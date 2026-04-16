import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

    await adminDb.collection('subscriptions').doc(userId).update({
      cancelAtPeriodEnd: true,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
