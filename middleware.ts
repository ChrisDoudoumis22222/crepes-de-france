// /middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Normalize only the PATH; keep protocol/host/query as-is
  const fixedPath = url.pathname.replace(/\/{2,}/g, "/");

  if (fixedPath !== url.pathname) {
    url.pathname = fixedPath;
    // REWRITE = serve the clean path without issuing a redirect -> no loops
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Skip Next internals & common static assets
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|css|js|json)).*)",
  ],
};
