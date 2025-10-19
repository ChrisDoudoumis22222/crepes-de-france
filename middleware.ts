import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const CANONICAL = 'shiny-tapioca-ef8b3d.netlify.app'; // optional canonical host

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // (optional) force canonical host
  if (url.hostname !== CANONICAL) {
    url.hostname = CANONICAL;
    return NextResponse.redirect(url, 308);
  }

  // collapse multiple slashes in PATH only
  const fixed = url.pathname.replace(/\/{2,}/g, '/');
  if (fixed !== url.pathname) {
    url.pathname = fixed;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = { matcher: '/:path*' };
