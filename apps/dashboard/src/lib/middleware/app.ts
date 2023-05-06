import { NextResponse, type NextRequest } from "next/server";

import { parseRequest } from "../utils";

export function AppMiddleware(req: NextRequest) {
  const { path } = parseRequest(req);

  return NextResponse.rewrite(new URL(`/app${path}`, req.url));
}
