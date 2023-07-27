import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { parseRequest } from "./utils";

export function ApiMiddleware(req: NextRequest) {
  const { path } = parseRequest(req);

  return NextResponse.rewrite(
    new URL(`/api${path === "/" ? "" : path}`, req.url),
  );
}
