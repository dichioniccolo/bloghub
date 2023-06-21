import { userAgent, type NextRequest } from "next/server";

import { and, db, eq, posts, projects, visits } from "@acme/db";

import { parseRequest } from "./utils";

export async function recordVisit(req: NextRequest, domain: string) {
  const { keys } = parseRequest(req);

  const ua = userAgent(req);
  const isPostPage = keys.startsWith("/posts/");

  if (!isPostPage) {
    return;
  }

  const project = await db
    .select({
      id: projects.id,
    })
    .from(projects)
    .where(eq(projects.domain, domain))
    .then((x) => x[0]);

  if (!project) {
    return;
  }

  // we need to regex the slug from the url because it can also contain a query string
  const postSlug = keys.replace("/posts/", "").replace(/\/.*/, "");

  const post = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(and(eq(posts.projectId, project.id), eq(posts.slug, postSlug)))
    .then((x) => x[0]);

  if (!post) {
    return;
  }

  await db.insert(visits).values({
    projectId: project.id,
    postId: post.id,
    body: {
      browser: ua.browser,
      os: ua.os,
      device: ua.device,
      engine: ua.engine,
      cpu: ua.cpu,
      geo: req.geo,
    },
  });
}
