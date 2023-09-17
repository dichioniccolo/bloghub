import type { NextFetchEvent, NextRequest } from "next/server";

import { API_HOSTNAMES, APP_HOSTNAMES } from "./lib/constants";
import { ApiMiddleware } from "./lib/middleware/api-middleware";
import { AppMiddleware } from "./lib/middleware/app-middleware";
import { BlogMiddleware } from "./lib/middleware/blog-middleware";
import { parseRequest } from "./lib/middleware/utils";

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain } = parseRequest(req);

  // if (HOME_HOSTNAMES.has(domain)) {
  //   return RootMiddleware(req);
  // }

  if (API_HOSTNAMES.has(domain)) {
    return ApiMiddleware(req);
  }

  if (APP_HOSTNAMES.has(domain)) {
    return AppMiddleware(req);
  }

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
