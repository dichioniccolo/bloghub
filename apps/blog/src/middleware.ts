import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";

import { env } from "./env.mjs";
import { recordVisit } from "./lib/middleware-utils";
import { parseRequest } from "./lib/utils";

export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, keys } = parseRequest(req);

  const testDomain = "test.niccolodichio.it";

  const finalDomain = env.NODE_ENV === "development" ? testDomain : domain;

  if (!finalDomain) {
    return NextResponse.next();
  }

  const url = new URL(req.url);

  const response = NextResponse.rewrite(
    new URL(
      `/${finalDomain}${keys}${
        url.searchParams.size === 0 ? "" : url.searchParams.toString()
      }`,
      url,
    ),
  );

  ev.waitUntil(recordVisit(req, finalDomain));

  return response;
}

export const config = {
  matcher: ["/((?!.*\\..*|login|api/.*|_next).*)"],
};
