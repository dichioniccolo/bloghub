import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { parseRequest } from "./utils";

export function RootMiddleware(req: NextRequest) {
  const { fullKey } = parseRequest(req);

  return NextResponse.rewrite(new URL(`/bloghub.it${fullKey}`, req.url));
}
