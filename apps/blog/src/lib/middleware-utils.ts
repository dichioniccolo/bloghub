import { userAgent, type NextRequest } from "next/server";

import { prisma, type Prisma } from "@acme/db";

import { parseRequest } from "./utils";

export async function recordVisit(req: NextRequest, domain: string) {
  const { keys } = parseRequest(req);

  const ua = userAgent(req);
  const isPostPage = keys.startsWith("/posts/");

  const project = await prisma.project.findUnique({
    where: {
      domain,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return;
  }

  const create = {
    project: {
      connect: {
        id: project.id,
      },
    },
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
  } satisfies Prisma.VisitCreateInput;

  if (!isPostPage) {
    return;
  }

  // we need to regex the slug from the url because it can also contain a query string
  const postSlug = keys.replace("/posts/", "").replace(/\/.*/, "");

  const post = await prisma.post.findUnique({
    where: {
      projectId_slug: {
        projectId: project.id,
        slug: postSlug,
      },
    },
  });

  if (!post) {
    return;
  }

  await prisma.visit.create({
    data: {
      ...create,
      post: {
        connect: {
          id: post.id,
        },
      },
    },
  });
}
