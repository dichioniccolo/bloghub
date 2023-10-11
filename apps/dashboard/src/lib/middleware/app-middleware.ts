import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { parseRequest } from "@acme/lib/utils";

export async function AppMiddleware(req: NextRequest) {
  const { path } = parseRequest(req);

  const session = await getToken({ req });

  if (!session?.email && path !== "/login") {
    const url = new URL("/login", req.url);

    if (path !== "/") url.searchParams.set("redirect", path);

    return NextResponse.redirect(url);
  }

  if (session?.email && path === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
