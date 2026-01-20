// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get user status from your auth (Auth0, cookies, session, etc.)
  const isProUser = request.cookies.get('user_tier')?.value === 'pro'; // Adjust based on your auth
  const path = request.nextUrl.pathname;

  // If Pro user tries to access home or free compare, redirect to Pro compare
  if (isProUser) {
    if (path === '/' || path === '/compare') {
      return NextResponse.redirect(new URL('/compare/pro', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/compare'],
};