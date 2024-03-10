import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { TEST_HOSTNAME } from "@acme/lib/constants";
import { parseRequest } from "@acme/lib/utils";

import { env } from "~/env.mjs";

export async function BlogMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain } = parseRequest(req);

  const url = req.nextUrl;

  const path = url.pathname;

  const finalDomain = env.NODE_ENV === "development" ? TEST_HOSTNAME : domain;

  // const postId = getPostIdFromSlug(path) ?? path.substring(1);

  // const post = await prisma.posts.findFirst({
  //   where: {
  //     id: postId,
  //     hidden: false,
  //     project: {
  //       domain: finalDomain,
  //     },
  //   },
  //   select: {
  //     id: true,
  //     projectId: true,
  //     title: true,
  //   },
  // });

  // if (!post) {
  //   // rewrite to the post, the 404 error will be handler in the route
  //   return NextResponse.rewrite(new URL(`/${finalDomain}${path}`, req.url));
  // }

  // const slug = generatePostSlug(post.title, post.id);

  // if (slug !== (path.startsWith("/") ? path.substring(1) : path)) {
  //   return NextResponse.redirect(`${getProtocol()}${domain}/${slug}`);
  // }

  // if (path.endsWith("opengraph-image")) {
  //   return NextResponse.rewrite(`${getProtocol()}${domain}${path}`);
  // }

  // ev.waitUntil(recordVisit(req, finalDomain, post));

  return NextResponse.rewrite(new URL(`/${finalDomain}${path}`, req.url));
}
