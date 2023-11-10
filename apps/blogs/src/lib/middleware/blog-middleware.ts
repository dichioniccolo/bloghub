import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { TEST_HOSTNAME } from "@acme/lib/constants";
import { getProtocol } from "@acme/lib/url";
import { parseRequest } from "@acme/lib/utils";

import { env } from "~/env.mjs";
import { recordVisit } from "./utils";

export function BlogMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain } = parseRequest(req);

  if (!domain) {
    return NextResponse.next();
  }

  const url = req.nextUrl;

  const path = url.pathname;

  const finalDomain = env.NODE_ENV === "development" ? TEST_HOSTNAME : domain;

  if (path.startsWith("/posts/")) {
    const postSlug = path.replace("/posts/", "").replace(/\/.*/, "");

    return NextResponse.redirect(`${getProtocol()}${domain}/${postSlug}`);
  }

  if (path.endsWith("opengraph-image")) {
    return NextResponse.rewrite(`${getProtocol()}${domain}${path}`);
  }

  ev.waitUntil(recordVisit(req, finalDomain));

  // rewrite everything else to `/[domain]/... dynamic route
  return NextResponse.rewrite(new URL(`/${finalDomain}${path}`, req.url));
}
