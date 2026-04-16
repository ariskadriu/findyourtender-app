import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/tenders', '/dashboard', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtected) {
    const token = request.cookies.get('firebase-token')?.value;
    
    if (!token) {
      // Not authenticated, redirect to login with callback URL
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Handle language redirects or other checks if needed here
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/tenders/:path*', '/dashboard/:path*', '/admin/:path*'],
};
