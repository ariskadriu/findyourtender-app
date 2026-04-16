# FindYourTender — Project Specification

## Overview
**FindYourTender** is a public tender aggregation SaaS platform for Kosovo. It scrapes tenders from the Kosovo government e-procurement portal (https://e-prokurimi.rks-gov.net), stores them in Firebase Firestore, and displays them in a subscription-gated dashboard. Users pay €10/month via Stripe to access full tender details.

> **We are a directory and information platform only — we do NOT handle tender applications.**

---

## Brand

| Property | Value |
|---|---|
| Name | FindYourTender |
| Tagline | Gjej. Krahaso. Shko. (Find. Compare. Go.) |
| Navy | #1A3A6B |
| Gold | #F0A500 |
| Blue | #2D6BE4 |
| White | #FFFFFF |
| Light Gray | #F5F7FA |
| Font | Inter (Google Fonts) |
| Logo | "FindYour" navy bold + "Tender" gold bold |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router + Tailwind CSS + shadcn/ui |
| Auth | Firebase Authentication (email/password + Google OAuth) |
| Database | Firebase Firestore |
| Payments | Stripe (€10/month recurring subscription) |
| Email | Resend (welcome, password reset, payment confirmation, tender alerts) |
| i18n | next-intl — sq (default), en, sr, de |
| Scraper | Python + BeautifulSoup + requests + APScheduler |
| Hosting | Vercel (Next.js) + Railway (Python scraper) |

---

## Firestore Schema

### `/users/{userId}`
```
uid: string
fullName: string
businessName: string
email: string
phone: string (optional)
language: "sq" | "en" | "sr" | "de"
subscriptionStatus: "active" | "inactive" | "cancelled"
subscriptionEndDate: Timestamp
stripeCustomerId: string
stripeSubscriptionId: string
savedTenders: string[]
notificationCategories: string[]
createdAt: Timestamp
```

### `/tenders/{tenderId}`
```
title: string
institution: string
category: string
region: string
status: "active" | "closed" | "upcoming"
publishedDate: Timestamp
deadline: Timestamp
estimatedValue: number
currency: "EUR"
description: string
cpvCodes: string[]
contactInfo: string
sourceUrl: string  ← CORE FIELD (official gov URL)
documents: { name: string, url: string }[]
createdAt: Timestamp
updatedAt: Timestamp
```

### `/subscriptions/{userId}`
```
stripeCustomerId: string
stripeSubscriptionId: string
status: string
currentPeriodEnd: Timestamp
cancelAtPeriodEnd: boolean
```

---

## Pages

### `/` — Landing Page
- Sticky navbar: logo, nav links, language switcher, Login + Register buttons
- Hero: bold headline + 2 CTAs ("Fillo Falas" → /register, "Shiko Tenderat" → /tenders)
- How It Works: 3 steps (Register → Search → Go to Tender)
- Features section
- Animated stats bar: 1,200+ Tenders, 50+ Institutions, 500+ Businesses
- Pricing card (€10/month)
- 3 testimonials
- Footer

### `/register`
- Fields: Full Name, Business Name, Email, Password, Phone (optional)
- Firebase `createUserWithEmailAndPassword`
- Create Firestore user doc
- Send verification email
- Redirect → /pricing

### `/login`
- Email + Password + Google OAuth
- Forgot password via Firebase
- After login: active subscription → /tenders, else → /pricing

### `/pricing`
- €10/month plan card with features list
- Stripe Checkout Session on click
- Success → /dashboard?subscribed=true
- Cancel → /pricing

### `/tenders` (auth + active subscription required)
- Search bar + filters: Category, Region, Status, Date range, Deadline range, Value range
- Sort: Newest / Deadline / Value
- Tender cards: title, institution, category badge, region, published date, deadline (red countdown <7 days), estimated value, status badge, "Shiko Detajet" button
- Pagination: 20/page
- Non-subscribed: paywall overlay with "Abonohu" CTA

### `/tenders/[id]` (auth + active subscription required)
- Full tender info
- Documents list (link to original source)
- Save/bookmark button
- Related tenders (same category)
- **Large gold CTA: "Shko te Tenderi Zyrtar" → opens sourceUrl in new tab**
- **NO apply form. NO file upload. NO submit.**

### `/dashboard` (auth required)
- Subscription status + renewal date + cancel option
- Saved tenders list
- Notification preferences (category-based email alerts)
- Account settings (name, email, password, language)

### `/about`
- Mission statement, why FindYourTender exists

### `/contact`
- Contact form via Resend → info@findyourtender.com
- Location: Prishtinë, Kosovë

### `/admin` (role: "admin" in Firestore)
- Users table
- Active subscribers count + MRR
- Tender management (add/edit/hide/feature)
- Manual scraper trigger

---

## Middleware
- Protect `/tenders`, `/tenders/[id]`, `/dashboard`
- Check Firebase ID token from cookie
- No token → redirect `/login`
- Valid token but `subscriptionStatus !== "active"` → redirect `/pricing`
- Admin routes check `role === "admin"`

---

## Stripe Webhooks

| Event | Action |
|---|---|
| `checkout.session.completed` | Set subscription active |
| `invoice.payment_failed` | Set inactive + send email |
| `customer.subscription.deleted` | Set cancelled |
| `customer.subscription.updated` | Sync status |

---

## i18n Translations (Hero)

| Lang | Headline | Subtext |
|---|---|---|
| sq | Gjej tenderat më të mirë në Kosovë | Platforma nr.1 për prokurimin publik — të gjitha tenderët në një vend |
| en | Find the best tenders in Kosovo | The #1 platform for public procurement — all tenders in one place |
| sr | Pronađite najbolje tendere na Kosovu | Platforma br. 1 za javne nabavke — svi tenderi na jednom mestu |
| de | Finden Sie die besten Ausschreibungen im Kosovo | Die Nr. 1 Plattform für öffentliche Beschaffung — alle Ausschreibungen an einem Ort |

---

## Python Scraper

- **File**: `scraper/main.py`
- **Target**: https://e-prokurimi.rks-gov.net
- **Libraries**: requests, beautifulsoup4, firebase-admin, apscheduler
- **Schedule**: Every 6 hours
- **Logic**:
  1. Fetch listings → parse title/institution/category/region/dates/value/sourceUrl/documents
  2. Check Firestore for duplicate `sourceUrl`
  3. If new → add to `/tenders`
  4. If existing → update status if deadline passed
- **Deploy**: Railway
- **Auth**: `FIREBASE_SERVICE_ACCOUNT_KEY` env var (JSON string)

---

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
ADMIN_EMAIL=info@findyourtender.com
```

---

## Verification Checklist
- [ ] Register → receive verification email → redirect to /pricing
- [ ] Complete Stripe payment → redirect to /dashboard
- [ ] Browse /tenders → filters + search work
- [ ] Open tender detail → "Shko te Tenderi Zyrtar" opens official gov link in new tab
- [ ] Switch language → all UI updates correctly
- [ ] Non-subscribed user hitting /tenders → sees paywall
