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
    browserName: ua.browser.name,
    browserVersion: ua.browser.version,
    osName: ua.os.name,
    osVersion: ua.os.version,
    deviceType: ua.device.type,
    deviceVendor: ua.device.vendor,
    deviceModel: ua.device.model,
    engineName: ua.engine.name,
    engineVersion: ua.engine.version,
    cpuArchitecture: ua.cpu.architecture,
    city: req.geo?.city,
    region: req.geo?.region,
    country: req.geo?.country,
    latitude: req.geo?.latitude,
    longitude: req.geo?.longitude,
  });
}
