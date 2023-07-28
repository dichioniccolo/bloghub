import type { NextRequest } from "next/server";
import { userAgent } from "next/server";

import { and, db, eq, posts, projects, visits } from "@bloghub/db";

import { env } from "~/env.mjs";
import { HOME_HOSTNAMES } from "../constants";

export const detectBot = (req: NextRequest) => {
  const url = req.nextUrl;
  if (url.searchParams.get("bot")) return true;
  const ua = req.headers.get("User-Agent");
  if (ua) {
    /* Note:
     * - bot is for most bots & crawlers
     * - ChatGPT is for ChatGPT
     * - facebookexternalhit is for Facebook crawler
     * - WhatsApp is for WhatsApp crawler
     * - MetaInspector is for https://metatags.io/
     */
    return /bot|chatgpt|facebookexternalhit|WhatsApp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector/i.test(
      ua,
    );
  }
  return false;
};

export async function recordVisit(req: NextRequest, domain: string) {
  const isBot = detectBot(req);

  if (isBot) {
    return;
  }

  const { fullKey } = parseRequest(req);

  const ua = userAgent(req);
  const isPostPage = fullKey.startsWith("/posts/");

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
  const postSlug = fullKey.replace("/posts/", "").replace(/\/.*/, "");

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
    referer: req.headers.get("referer"),
    browserName: ua.browser.name,
    browserVersion: ua.browser.version,
    osName: ua.os.name,
    osVersion: ua.os.version,
    deviceModel: ua.device.model,
    deviceType: ua.device.type,
    deviceVendor: ua.device.vendor,
    engineName: ua.engine.name,
    engineVersion: ua.engine.version,
    cpuArchitecture: ua.cpu.architecture,
    geoCountry: req.geo?.country,
    geoRegion: req.geo?.region,
    geoCity: req.geo?.city,
    geoLatitude: req.geo?.latitude,
    geoLongitude: req.geo?.longitude,
  });
}

export function parseRequest(req: NextRequest) {
  let domain = req.headers.get("host") as string;
  domain = domain.replace("www.", ""); // remove www. from domain
  if (HOME_HOSTNAMES.has(domain)) domain = env.NEXT_PUBLIC_APP_DOMAIN; // if domain is a home hostname, set it to NEXT_PUBLIC_APP_DOMAIN

  const path = req.nextUrl.pathname;

  // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const key = decodeURIComponent(path.split("/")[1]);
  const fullKey = decodeURIComponent(path.slice(1));

  return { domain, path, key, fullKey };
}