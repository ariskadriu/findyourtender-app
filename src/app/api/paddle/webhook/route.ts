import { NextRequest, NextResponse } from 'next/server';
import { paddle } from '@/lib/paddle';
import { adminDb } from '@/lib/firebase-admin';
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('paddle-signature') || '';
  const rawBody = await req.text();

  try {
    // Verify the webhook signature
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';
    const eventData = await paddle.webhooks.unmarshal(rawBody, webhookSecret, signature);

    const event = eventData as any;
    const type = event.eventType || event.event_type;

    switch (type) {
      case 'subscription.activated':
      case 'transaction.completed': {
        const sub = event.data;
        const firebaseUid = sub?.customData?.firebaseUid;
        if (!firebaseUid) break;

        const endDate = sub.currentBillingPeriod?.endsAt
          ? new Date(sub.currentBillingPeriod.endsAt)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await adminDb.collection('users').doc(firebaseUid).update({
          subscriptionStatus: 'active',
          paddleSubscriptionId: sub.id,
          subscriptionEndDate: endDate,
        });

        const userDoc = await adminDb.collection('users').doc(firebaseUid).get();
        const userData = userDoc.data();
        if (userData?.email) {
          await sendPaymentConfirmationEmail(userData.email, userData.fullName || '');
        }
        break;
      }

      case 'subscription.canceled': {
        const sub = event.data;
        const firebaseUid = sub?.customData?.firebaseUid;
        if (!firebaseUid) break;

        await adminDb.collection('users').doc(firebaseUid).update({
          subscriptionStatus: 'cancelled',
          paddleSubscriptionId: null,
        });
        break;
      }

      case 'subscription.past_due':
      case 'transaction.payment_failed': {
        const sub = event.data;
        const firebaseUid = sub?.customData?.firebaseUid;
        if (!firebaseUid) break;

        await adminDb.collection('users').doc(firebaseUid).update({
          subscriptionStatus: 'inactive',
        });

        const userDoc = await adminDb.collection('users').doc(firebaseUid).get();
        const userData = userDoc.data();
        if (userData?.email) {
          await sendPaymentFailedEmail(userData.email, userData.fullName || '');
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Paddle webhook error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}
