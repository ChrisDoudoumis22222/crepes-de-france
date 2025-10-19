// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Collapse any "////" to "/"
  const normalized = url.pathname.replace(/\/{2,}/g, '/');

  if (normalized !== url.pathname) {
    url.pathname = normalized;
    // Preserve query string; 308 = permanent
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // run on all routes
};
