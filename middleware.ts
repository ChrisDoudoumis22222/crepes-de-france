import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const CANONICAL = 'shiny-tapioca-ef8b3d.netlify.app';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // (Optional) force canonical host (www or custom domain → your Netlify URL)
  if (url.hostname !== CANONICAL) {
    url.hostname = CANONICAL;
    return NextResponse.redirect(url, 308);
  }

  // Collapse multiple slashes in PATH only (keep protocol/host/query)
  const normalizedPath = url.pathname.replace(/\/{2,}/g, '/');
  if (normalizedPath !== url.pathname) {
    url.pathname = normalizedPath;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // run for all paths
};
