import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TendersClient from '@/components/TendersClient';
import { Tender } from '@/types';

const PAGE_SIZE = 20;

async function getTenders(searchParams: { [key: string]: string | undefined }) {
  const { category, region, status, sort = 'newest', q: searchQuery, page = '1' } = searchParams;
  const currentPage = parseInt(page);

  try {
    let query = adminDb.collection('tenders').where('hidden', '!=', true).where('status', '!=', 'draft');

    if (status && status !== 'draft') {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }
    if (region) {
      query = query.where('region', '==', region);
    }

    const sortField = sort === 'newest' ? 'publishedDate' : sort === 'deadline' ? 'deadline' : 'estimatedValue';
    query = query.orderBy(sortField, 'desc').limit(PAGE_SIZE);

    if (currentPage > 1) {
      // For simple server-side pagination without lastDoc, we use offset
      // Note: Offset is less performant but easier for server components without passing blobs
      query = query.offset((currentPage - 1) * PAGE_SIZE);
    }

    const snapshot = await query.get();
    const tenders = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishedDate: data.publishedDate?.toDate()?.toISOString(),
        deadline: data.deadline?.toDate()?.toISOString(),
        createdAt: data.createdAt?.toDate()?.toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString(),
      };
    }) as Tender[];

    // Server-side filtering for search query if present
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return tenders.filter(t => 
        t.title?.toLowerCase().includes(lowerQuery) || 
        t.institution?.toLowerCase().includes(lowerQuery)
      );
    }

    return tenders;
  } catch (err) {
    console.error('Error fetching tenders on server:', err);
    return [];
  }
}

async function checkSubscription(userId: string) {
  try {
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) return false;
    return userDoc.data()?.subscriptionStatus === 'active';
  } catch (err) {
    console.error('Error checking subscription:', err);
    return false;
  }
}

export default async function TendersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Load raw translations for the client component
  const translations = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'locales', 'sq.json'), 
      'utf8'
    )
  );

  const cookieStore = cookies();
  const token = cookieStore.get('firebase-token')?.value;
  
  let userId = '';
  let isSubscribed = false;

  if (token) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
      isSubscribed = await checkSubscription(userId);
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  const tenders = await getTenders(searchParams);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar />
      <div className="pt-20 pb-16">
        <TendersClient 
          initialTenders={tenders} 
          isSubscribed={isSubscribed}
          translations={translations}
        />
      </div>
      <Footer />
    </div>
  );
}
