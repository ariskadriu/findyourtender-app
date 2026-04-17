import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { sendPasswordResetEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate accurate password reset link using Admin SDK
    // This uses the Action URL configured in Firebase (or default)
    const resetLink = await adminAuth.generatePasswordResetLink(email, {
       url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    });

    // Send the link via Resend
    await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Password reset API error:', err);
    // If user not found, we still return success to prevent email enumeration, 
    // or we can handle specific codes if preferred.
    if (err.code === 'auth/user-not-found') {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
