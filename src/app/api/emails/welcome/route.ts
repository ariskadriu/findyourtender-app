import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    await sendWelcomeEmail(email, name);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Welcome email error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
