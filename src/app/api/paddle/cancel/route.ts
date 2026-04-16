import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { paddle } from '@/lib/paddle';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(token);

    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return NextResponse.json({ error: 'No subscription ID' }, { status: 400 });
    }

    await paddle.subscriptions.cancel(subscriptionId, { effectiveFrom: 'next_billing_period' });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Paddle cancel error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
