import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@acme/db";
import { TEST_HOSTNAME } from "@acme/lib/constants";
import { getProtocol } from "@acme/lib/url";
import {
  generatePostSlug,
  getPostIdFromSlug,
  parseRequest,
} from "@acme/lib/utils";

import { env } from "~/env";
import { ratelimit } from "../ratelimit";
import { recordVisit } from "./utils";

export async function BlogMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain } = parseRequest(req);

  const url = req.nextUrl;

  const path = url.pathname;

  if (path.endsWith("opengraph-image")) {
    return NextResponse.rewrite(`${getProtocol()}${domain}${path}`);
  }

  const finalDomain = env.NODE_ENV === "development" ? TEST_HOSTNAME : domain;

  const postId = getPostIdFromSlug(path) ?? path.substring(1);

  if (env.NODE_ENV === "production") {
    const ip = req.ip ?? "127.0.0.1";

    const { success, pending, limit, remaining, reset } =
      await ratelimit.limit(ip);

    ev.waitUntil(pending);

    if (!success) {
      const res = NextResponse.json("Rate limit exceeded", { status: 429 });

      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());

      return res;
    }
  }

  if (path === "/" || !postId) {
    return NextResponse.rewrite(new URL(`/${finalDomain}${path}`, req.url));
  }

  const post = await prisma.posts.findFirst({
    where: {
      id: postId,
      hidden: false,
      project: {
        domain: finalDomain,
      },
    },
    select: {
      id: true,
      projectId: true,
      title: true,
    },
  });

  if (!post) {
    // rewrite to the post, the 404 error will be handler in the route
    return NextResponse.redirect(`${getProtocol()}${domain}`);
  }

  const slug = generatePostSlug(post.title, post.id);

  if (slug !== (path.startsWith("/") ? path.substring(1) : path)) {
    return NextResponse.redirect(`${getProtocol()}${domain}/${slug}`);
  }

  ev.waitUntil(recordVisit(req, finalDomain, post));

  return NextResponse.rewrite(new URL(`/${finalDomain}${path}`, req.url));
}
