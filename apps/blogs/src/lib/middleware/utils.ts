import type { NextRequest } from "next/server";
import { userAgent } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { ipAddress } from "@vercel/edge";
import { kv } from "@vercel/kv";

import { and, db, eq, isNull, posts, projects, visits } from "@acme/db";
import { parseRequest } from "@acme/lib/utils";

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
  const referer = req.headers.get("referer");
  const ip = ipAddress(req) ?? "127.0.0.1";
  const isPostPage =
    fullKey.startsWith("posts/") && !fullKey.includes("opengraph-image");

  if (!isPostPage) {
    return;
  }

  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(2, "1 h"),
  });

  const { success } = await ratelimit.limit(
    `recordVisit:${ip}:${domain}:${fullKey}`,
  );

  if (!success) {
    return;
  }

  const project = await db
    .select({
      id: projects.id,
    })
    .from(projects)
    .where(and(eq(projects.domain, domain), isNull(projects.deletedAt)))
    .then((x) => x[0]);

  if (!project) {
    return;
  }

  // we need to regex the slug from the url because it can also contain a query string
  const postSlug = fullKey.replace("posts/", "").replace(/\/.*/, "");

  const post = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(
      and(
        eq(posts.projectId, project.id),
        eq(posts.slug, postSlug),
        eq(posts.hidden, false), // we only want to record visits for non-hidden posts
      ),
    )
    .then((x) => x[0]);

  if (!post) {
    return;
  }

  // if the referer domain is the same as the current domain, we want to record "self"
  // otherwise, we want to record the referer domain
  const refererDomain = referer
    ? new URL(referer).hostname === domain
      ? "SELF"
      : new URL(referer).hostname
    : null;

  await db.insert(visits).values({
    projectId: project.id,
    postId: post.id,
    referer: refererDomain,
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
