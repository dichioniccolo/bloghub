import type { NextFetchEvent, NextRequest } from "next/server";

import { BlogMiddleware } from "./lib/middleware/blog-middleware";

export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  return BlogMiddleware(req, ev);
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
