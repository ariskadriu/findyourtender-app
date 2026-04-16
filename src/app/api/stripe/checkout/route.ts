import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    let stripeCustomerId = userData?.stripeCustomerId;

    // Create Stripe customer if not exists
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: decoded.email || '',
        name: userData?.fullName || '',
        metadata: { firebaseUid: userId },
      });
      stripeCustomerId = customer.id;
      await adminDb.collection('users').doc(userId).update({ stripeCustomerId });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { firebaseUid: userId },
      subscription_data: { metadata: { firebaseUid: userId } },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
