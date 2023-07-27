import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "~/env.mjs";
import { TEST_HOSTNAME } from "../constants";
import { parseRequest, recordVisit } from "./utils";

export function BlogMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, fullKey: key } = parseRequest(req);

  if (!domain || !key) {
    return NextResponse.next();
  }

  const finalDomain = env.NODE_ENV === "development" ? TEST_HOSTNAME : domain;

  ev.waitUntil(recordVisit(req, finalDomain));

  // // rewrite everything else to `/[domain]/... dynamic route
  return NextResponse.rewrite(
    new URL(`/${finalDomain}${key === "/" ? "" : key}`, req.url),
  );
}
