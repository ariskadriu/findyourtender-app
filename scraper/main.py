#!/usr/bin/env python3
"""
FindYourTender — Kosovo Public Procurement Scraper
Target: https://e-prokurimi.rks-gov.net
Schedule: Every 6 hours
Deploy: Railway
"""

import os
import json
import logging
import hashlib
from datetime import datetime, timezone
from typing import Optional

import requests
from bs4 import BeautifulSoup
from apscheduler.schedulers.blocking import BlockingScheduler
import firebase_admin
from firebase_admin import credentials, firestore

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

# ─── Firebase Init ───────────────────────────────────────────────────────────
def init_firebase():
    if not firebase_admin._apps:
        service_account_json = os.environ.get('FIREBASE_SERVICE_ACCOUNT_KEY')
        if not service_account_json:
            raise ValueError("FIREBASE_SERVICE_ACCOUNT_KEY env var is required")
        cred_dict = json.loads(service_account_json)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    return firestore.client()

# ─── Scraper ─────────────────────────────────────────────────────────────────
BASE_URL = "https://e-prokurimi.rks-gov.net"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "sq,en-US;q=0.9,en;q=0.8",
}

CATEGORY_MAP = {
    'ndertim': 'Ndërtim',
    'construction': 'Ndërtim',
    'it': 'IT dhe Teknologji',
    'informatike': 'IT dhe Teknologji',
    'shendetesi': 'Shëndetësi',
    'health': 'Shëndetësi',
    'arsim': 'Arsim',
    'education': 'Arsim',
    'transport': 'Transport',
    'energji': 'Energji',
    'energy': 'Energji',
    'bujqesi': 'Bujqësi',
    'konsulence': 'Shërbime Konsulence',
}

REGION_LIST = [
    'Prishtinë', 'Prizren', 'Pejë', 'Mitrovicë', 'Gjilan',
    'Ferizaj', 'Gjakovë', 'Vushtrri', 'Suharekë', 'Rahovec', 'Klinë', 'Dragash'
]

def detect_region(text: str) -> str:
    text_lower = text.lower()
    for region in REGION_LIST:
        if region.lower().replace('ë', 'e').replace('ç', 'c') in text_lower or region.lower() in text_lower:
            return region
    return 'Tjetër'

def detect_category(text: str) -> str:
    text_lower = text.lower()
    for key, cat in CATEGORY_MAP.items():
        if key in text_lower:
            return cat
    return 'Tjetër'

def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    if not date_str:
        return None
    formats = ['%d.%m.%Y', '%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y %H:%M']
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    return None

def parse_value(text: Optional[str]) -> Optional[float]:
    if not text:
        return None
    # Remove non-numeric chars except dot and comma
    clean = ''.join(c for c in text if c.isdigit() or c in '.,')
    clean = clean.replace(',', '.')
    try:
        return float(clean)
    except ValueError:
        return None

def generate_tender_id(source_url: str) -> str:
    return hashlib.md5(source_url.encode()).hexdigest()[:20]

def scrape_tender_list(page: int = 1) -> list[dict]:
    """Fetch the main tender listing page."""
    try:
        url = f"{BASE_URL}/tenderi?page={page}"
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')

        tenders = []

        # Try multiple possible selectors for the tender listing
        rows = (
            soup.select('table.table tbody tr') or
            soup.select('.tender-row') or
            soup.select('.procurement-item') or
            soup.select('tr[data-href]')
        )

        for row in rows:
            try:
                # Extract link/title
                link_el = row.select_one('a[href]')
                if not link_el:
                    continue

                href = link_el.get('href', '')
                source_url = href if href.startswith('http') else f"{BASE_URL}{href}"
                title = link_el.get_text(strip=True) or 'Tender pa titull'

                # Extract cells
                cells = row.find_all('td')
                cell_texts = [c.get_text(strip=True) for c in cells]

                institution = cell_texts[1] if len(cell_texts) > 1 else ''
                deadline_str = cell_texts[3] if len(cell_texts) > 3 else ''
                published_str = cell_texts[2] if len(cell_texts) > 2 else ''
                value_str = cell_texts[4] if len(cell_texts) > 4 else ''

                tenders.append({
                    'sourceUrl': source_url,
                    'title': title,
                    'institution': institution,
                    'deadline_str': deadline_str,
                    'published_str': published_str,
                    'value_str': value_str,
                })
            except Exception as e:
                logger.warning(f"Error parsing row: {e}")
                continue

        return tenders
    except Exception as e:
        logger.error(f"Error fetching page {page}: {e}")
        return []

def scrape_tender_detail(source_url: str) -> dict:
    """Fetch detailed info for a single tender."""
    try:
        resp = requests.get(source_url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')

        def get_text(*selectors) -> str:
            for sel in selectors:
                el = soup.select_one(sel)
                if el:
                    return el.get_text(strip=True)
            return ''

        description = get_text(
            '.tender-description', '.description',
            '#description', 'div.content p'
        )

        contact_info = get_text(
            '.contact-info', '.contact', '#contact'
        )

        # Extract documents
        documents = []
        for a in soup.select('a[href*=".pdf"], a[href*=".docx"], a[href*=".doc"], a[href*="download"]'):
            doc_name = a.get_text(strip=True) or 'Dokument'
            doc_href = a.get('href', '')
            doc_url = doc_href if doc_href.startswith('http') else f"{BASE_URL}{doc_href}"
            if doc_name and doc_url:
                documents.append({'name': doc_name, 'url': doc_url})

        return {
            'description': description or 'Përshkrim i paavailushëm.',
            'contactInfo': contact_info,
            'documents': documents[:10],  # max 10 docs
        }
    except Exception as e:
        logger.warning(f"Could not fetch detail for {source_url}: {e}")
        return {'description': '', 'contactInfo': '', 'documents': []}

def process_tender(db_client, tender_data: dict) -> None:
    """Process a single tender — add new or update existing."""
    source_url = tender_data['sourceUrl']
    tender_id = generate_tender_id(source_url)

    try:
        doc_ref = db_client.collection('tenders').document(tender_id)
        existing = doc_ref.get()

        deadline = parse_date(tender_data.get('deadline_str'))
        published = parse_date(tender_data.get('published_str'))
        value = parse_value(tender_data.get('value_str'))

        now = datetime.now(timezone.utc)
        status = 'active'
        if deadline and deadline < now:
            status = 'closed'
        elif published and published > now:
            status = 'upcoming'

        if existing.exists:
            # Just update status if deadline passed
            existing_data = existing.to_dict()
            if existing_data.get('status') != status:
                doc_ref.update({'status': status, 'updatedAt': now})
                logger.info(f"Updated status for: {tender_data['title'][:50]}")
        else:
            # Get detail page
            detail = scrape_tender_detail(source_url)

            title = tender_data['title']
            institution = tender_data.get('institution', '')
            full_text = f"{title} {institution} {detail.get('description', '')}"

            category = detect_category(full_text)
            region = detect_region(f"{institution} {full_text}")

            new_tender = {
                'title': title,
                'institution': institution,
                'category': category,
                'region': region,
                'status': status,
                'publishedDate': published or now,
                'deadline': deadline,
                'estimatedValue': value,
                'currency': 'EUR',
                'description': detail['description'],
                'cpvCodes': [],
                'contactInfo': detail['contactInfo'],
                'sourceUrl': source_url,
                'documents': detail['documents'],
                'hidden': False,
                'featured': False,
                'createdAt': now,
                'updatedAt': now,
            }
            doc_ref.set(new_tender)
            logger.info(f"✅ Added new tender: {title[:60]}")

    except Exception as e:
        logger.error(f"Error processing tender {source_url}: {e}")

def run_scraper():
    """Main scraper function — runs every 6 hours."""
    logger.info("🚀 Starting FindYourTender scraper...")
    try:
        db_client = init_firebase()
        total_new = 0

        # Scrape first 5 pages
        for page in range(1, 6):
            logger.info(f"Scraping page {page}...")
            tenders = scrape_tender_list(page)

            if not tenders:
                logger.info(f"No tenders found on page {page}, stopping.")
                break

            for tender in tenders:
                process_tender(db_client, tender)
                total_new += 1

        logger.info(f"✅ Scraper complete. Processed {total_new} tenders.")

    except Exception as e:
        logger.error(f"❌ Scraper failed: {e}")
        raise

# ─── Entry Point ─────────────────────────────────────────────────────────────
if __name__ == '__main__':
    mode = os.environ.get('RUN_MODE', 'scheduled')

    if mode == 'once':
        # For testing — run once and exit
        run_scraper()
    else:
        # Scheduled mode — run every 6 hours
        scheduler = BlockingScheduler(timezone='Europe/Podgorica')

        # Run immediately on start
        run_scraper()

        # Then every 6 hours
        scheduler.add_job(
            run_scraper,
            'interval',
            hours=6,
            id='tender_scraper',
            name='Kosovo Tender Scraper',
        )

        logger.info("⏰ Scheduler started — running every 6 hours")
        try:
            scheduler.start()
        except (KeyboardInterrupt, SystemExit):
            logger.info("Scheduler stopped.")
