// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  // Normalize repeated slashes in PATH ONLY (keep protocol/host/query)
  const normalizedPath = url.pathname.replace(/\/{2,}/g, '/')

  if (normalizedPath !== url.pathname) {
    url.pathname = normalizedPath
    // 308 = permanent, preserves method/body if needed
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
