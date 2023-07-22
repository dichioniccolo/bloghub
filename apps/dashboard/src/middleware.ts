import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { env } from "./env.mjs";
import { recordVisit } from "./lib/middleware-utils";
import { TEST_HOSTNAME } from "./lib/utils";

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl;

  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${env.NEXT_PUBLIC_APP_DOMAIN}`);

  const path = url.pathname;

  if (hostname === `app.${env.NEXT_PUBLIC_APP_DOMAIN}`) {
    const session = await getToken({ req });
    if (!session && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (session && path == "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  } else if (hostname === `api.${env.NEXT_PUBLIC_APP_DOMAIN}`) {
    return NextResponse.rewrite(new URL(`/api${path}`, req.url));
  } else if (hostname === env.NEXT_PUBLIC_APP_DOMAIN) {
    return NextResponse.next();
  }

  const finalHostname =
    env.NODE_ENV === "development" ? TEST_HOSTNAME : hostname;

  ev.waitUntil(recordVisit(req, finalHostname));

  return NextResponse.rewrite(new URL(`/${finalHostname}${path}`, req.url));
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
