import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@acme/auth";
import { API_HOSTNAMES } from "@acme/lib/constants";
import { parseRequest } from "@acme/lib/utils";

import { ApiMiddleware } from "~/lib/middleware/api-middleware";
import { env } from "./env.mjs";
import { ratelimit } from "./lib/ratelimit";

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  return auth(async (req) => {
    const { path, domain } = parseRequest(req);

    if (API_HOSTNAMES.has(domain)) {
      return ApiMiddleware(req);
    }

    if (env.NODE_ENV === "production") {
      const ip = req.ip ?? "127.0.0.1";

      const { success, pending, limit, remaining, reset } =
        await ratelimit.limit(ip);

      event.waitUntil(pending);

      if (!success) {
        const res = NextResponse.json("Rate limit exceeded", { status: 429 });
        res.headers.set("X-RateLimit-Limit", limit.toString());
        res.headers.set("X-RateLimit-Remaining", remaining.toString());
        res.headers.set("X-RateLimit-Reset", reset.toString());
        return res;
      }
    }

    if (!req.auth?.user && path !== "/login") {
      const url = new URL("/login", req.url);
      if (path !== "/") url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    if (!!req.auth?.user && path === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  })(req, null!);
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
