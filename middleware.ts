// /middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Normalize only the PATH (leave protocol/host/query alone)
  const current = req.nextUrl;
  const fixedPath = current.pathname.replace(/\/{2,}/g, "/");

  if (fixedPath !== current.pathname) {
    const dest = current.clone();
    dest.pathname = fixedPath;
    // 308 permanent; safe for GETs
    return NextResponse.redirect(dest, 308);
  }

  return NextResponse.next();
}

// Exclude Next internals and common static assets from running the middleware
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|css|js|json)).*)",
  ],
};
