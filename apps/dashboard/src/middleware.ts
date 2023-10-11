import type { NextRequest } from "next/server";

import { API_HOSTNAMES } from "@acme/lib/constants";
import { parseRequest } from "@acme/lib/utils";

import { ApiMiddleware } from "./lib/middleware/api-middleware";
import { AppMiddleware } from "./lib/middleware/app-middleware";

export default async function middleware(req: NextRequest) {
  const { domain } = parseRequest(req);

  if (API_HOSTNAMES.has(domain)) {
    return ApiMiddleware(req);
  }

  return AppMiddleware(req);
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
