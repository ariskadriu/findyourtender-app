import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import * as cheerio from 'cheerio';
import { mapFppToCategory } from '@/lib/categorizer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 0. Authorization check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Optional: Check if admin role
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (userDoc.data()?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Fetch the portal page
    const portalUrl = 'https://e-prokurimi.rks-gov.net/Default.aspx?PID=335&LID=1';
    const response = await fetch(portalUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    
    if (!response.ok) throw new Error('Portal unreachable');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const tenders: any[] = [];
    const tableRows = $('#uiView_gridResults tr');

    tableRows.each((i, row) => {
      // Skip header row
      if (i === 0) return;

      const cols = $(row).find('td');
      if (cols.length < 5) return;

      const title = $(cols[2]).text().trim();
      const institution = $(cols[3]).text().trim();
      const fppCode = $(cols[4]).text().trim();
      const valueText = $(cols[5]).text().trim().replace(/[^\d.-]/g, '');
      const deadlineText = $(cols[6]).text().trim();
      const relativeLink = $(cols[2]).find('a').attr('href') || '';
      
      const sourceUrl = relativeLink.startsWith('http') 
        ? relativeLink 
        : `https://e-prokurimi.rks-gov.net/${relativeLink}`;

      if (title && sourceUrl) {
        tenders.push({
          title,
          institution,
          category: mapFppToCategory(fppCode),
          region: 'Tjetër', // Portali nuk jep rajonin ne listë, duhet vizituar faqja specifike
          status: 'draft', // Saved to drafts for admin review
          publishedDate: new Date(),
          deadline: parseKosovoDate(deadlineText) || new Date(),
          estimatedValue: parseFloat(valueText) || 0,
          currency: 'EUR',
          description: `Auto-scraped from e-prokurimi. FPP: ${fppCode}`,
          cpvCodes: [fppCode],
          sourceUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    // 2. Save only "new" tenders (basic check by Source URL)
    let savedCount = 0;
    for (const tender of tenders) {
        const existing = await adminDb.collection('tenders')
            .where('sourceUrl', '==', tender.sourceUrl)
            .limit(1)
            .get();
        
        if (existing.empty) {
            await adminDb.collection('tenders').add(tender);
            savedCount++;
        }
    }

    return NextResponse.json({ 
      success: true, 
      scraped: tenders.length, 
      newDrafts: savedCount 
    });

  } catch (err: any) {
    console.error('Scraper Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper to parse Kosovo format like "17.04.2024 14:00:00"
function parseKosovoDate(dateStr: string) {
    if (!dateStr) return null;
    const parts = dateStr.split(' ')[0].split('.');
    if (parts.length === 3) {
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
    return null;
}
