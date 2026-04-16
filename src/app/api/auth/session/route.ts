import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const cookieStore = cookies();
    cookieStore.set('firebase-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: '/',
      sameSite: 'lax',
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to set session' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('firebase-token');
  return NextResponse.json({ success: true });
}
