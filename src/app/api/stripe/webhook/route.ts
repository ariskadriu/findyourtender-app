import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail } from '@/lib/resend';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const firebaseUid = session.metadata?.firebaseUid;
        if (firebaseUid && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);

          await adminDb.collection('users').doc(firebaseUid).update({
            subscriptionStatus: 'active',
            stripeSubscriptionId: subscription.id,
            subscriptionEndDate: currentPeriodEnd,
          });

          await adminDb.collection('subscriptions').doc(firebaseUid).set({
            stripeCustomerId: session.customer,
            stripeSubscriptionId: subscription.id,
            status: 'active',
            currentPeriodEnd,
            cancelAtPeriodEnd: false,
          });

          // Send confirmation email
          const userDoc = await adminDb.collection('users').doc(firebaseUid).get();
          const userData = userDoc.data();
          if (userData?.email) {
            await sendPaymentConfirmationEmail(userData.email, userData.fullName || '');
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const snapshot = await adminDb.collection('users')
          .where('stripeCustomerId', '==', customerId).limit(1).get();

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          await userDoc.ref.update({ subscriptionStatus: 'inactive' });
          const userData = userDoc.data();
          if (userData?.email) {
            await sendPaymentFailedEmail(userData.email, userData.fullName || '');
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const firebaseUid = subscription.metadata?.firebaseUid;
        if (firebaseUid) {
          await adminDb.collection('users').doc(firebaseUid).update({
            subscriptionStatus: 'cancelled',
            stripeSubscriptionId: FieldValue.delete(),
          });
          await adminDb.collection('subscriptions').doc(firebaseUid).update({
            status: 'cancelled',
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const firebaseUid = subscription.metadata?.firebaseUid;
        if (firebaseUid) {
          const status = subscription.status === 'active' ? 'active' : 'inactive';
          const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);
          await adminDb.collection('users').doc(firebaseUid).update({
            subscriptionStatus: status,
            subscriptionEndDate: currentPeriodEnd,
          });
          await adminDb.collection('subscriptions').doc(firebaseUid).update({
            status,
            currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  return NextResponse.json({ received: true });
}
