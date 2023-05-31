import { NextResponse, type NextRequest } from "next/server";

import { env } from "./env.mjs";
import { parseRequest } from "./lib/utils";

export default function middleware(req: NextRequest) {
  const { domain, keys } = parseRequest(req);

  const testDomain = "test.niccolodichio.it";

  const finalDomain = env.NODE_ENV === "development" ? testDomain : domain;

  if (!finalDomain) {
    return NextResponse.next();
  }

  // if (keys === "/") {
  //   return NextResponse.rewrite(new URL(`/blog/${finalDomain}`, req.url));
  // }

  const url = new URL(req.url);

  return NextResponse.rewrite(
    new URL(`/blog/${finalDomain}${keys}?${url.searchParams.toString()}`, url),
  );
}

export const config = {
  matcher: ["/((?!.*\\..*|login|api/.*|_next).*)"],
};
