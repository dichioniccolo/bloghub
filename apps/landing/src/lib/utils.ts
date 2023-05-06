import { type NextRequest } from "next/server";

export function parseRequest(req: NextRequest) {
  const domain = req.headers.get("host") ?? "";
  const path = req.nextUrl.pathname;

  const paths = path.split("/");

  const keys = decodeURIComponent(paths.join("/"));

  return { domain, path, keys };
}
