import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { and, db, eq, exists, schema } from "@acme/db";
import { TEST_HOSTNAME } from "@acme/lib/constants";
import { getProtocol } from "@acme/lib/url";
import {
  generatePostSlug,
  getPostIdFromSlug,
  parseRequest,
} from "@acme/lib/utils";

import { env } from "~/env.mjs";
import { recordVisit } from "./utils";

export async function BlogMiddleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain } = parseRequest(req);

  const url = req.nextUrl;

  const path = url.pathname;

  const finalDomain = env.NODE_ENV === "development" ? TEST_HOSTNAME : domain;

  const postId = getPostIdFromSlug(path) ?? path.substring(1);

  const post = await db
    .select({
      id: schema.posts.id,
      projectId: schema.posts.projectId,
      title: schema.posts.title,
    })
    .from(schema.posts)
    .where(
      and(
        eq(schema.posts.hidden, 0),
        eq(schema.posts.id, postId),
        exists(
          db
            .select()
            .from(schema.projects)
            .where(
              and(
                eq(schema.projects.id, schema.posts.projectId),
                eq(schema.projects.domain, finalDomain),
              ),
            ),
        ),
      ),
    )
    .then((x) => x[0]);

  if (!post) {
    // rewrite to the post, the 404 error will be handler in the route
    return NextResponse.rewrite(new URL(`/${finalDomain}${path}`, req.url));
  }

  const slug = generatePostSlug(post.title, post.id);

  if (slug !== (path.startsWith("/") ? path.substring(1) : path)) {
    return NextResponse.redirect(`${getProtocol()}${domain}/${slug}`);
  }

  if (path.endsWith("opengraph-image")) {
    return NextResponse.rewrite(`${getProtocol()}${domain}${path}`);
  }

  ev.waitUntil(recordVisit(req, finalDomain, post));

  return NextResponse.rewrite(new URL(`/${finalDomain}${path}`, req.url));
}
