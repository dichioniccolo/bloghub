import type { NextRequest } from "next/server";
import { userAgent } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { ipAddress } from "@vercel/edge";
import { kv } from "@vercel/kv";

import { and, drizzleDb, eq, exists, schema } from "@acme/db";
import { SELF_REFERER, UNKNOWN_ANALYTICS_VALUE } from "@acme/lib/constants";
import { parseRequest } from "@acme/lib/utils";

import { env } from "~/env.mjs";

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

  if (fullKey.length === 0 || fullKey === "/") {
    return;
  }

  const ua = userAgent(req);
  const referer = req.headers.get("referer");
  const ip = ipAddress(req) ?? "127.0.0.1";

  if (env.NODE_ENV === "production") {
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
  }

  // we need to regex the slug from the url because it can also contain a query string
  const slug = fullKey.replace("posts/", "").replace(/\/.*/, "");

  const post = await drizzleDb
    .select({
      id: schema.posts.id,
      projectId: schema.posts.projectId,
    })
    .from(schema.posts)
    .where(
      and(
        eq(schema.posts.hidden, 0),
        eq(schema.posts.slug, slug),
        exists(
          drizzleDb
            .select()
            .from(schema.projects)
            .where(
              and(
                eq(schema.projects.id, schema.posts.projectId),
                eq(schema.projects.domain, domain),
              ),
            ),
        ),
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
      ? SELF_REFERER
      : new URL(referer).hostname
    : SELF_REFERER;

  await drizzleDb.insert(schema.visits).values({
    projectId: post.projectId,
    postId: post.id,
    referer: refererDomain ?? SELF_REFERER,
    browserName: ua.browser.name ?? UNKNOWN_ANALYTICS_VALUE,
    browserVersion: ua.browser.version ?? UNKNOWN_ANALYTICS_VALUE,
    osName: ua.os.name ?? UNKNOWN_ANALYTICS_VALUE,
    osVersion: ua.os.version ?? UNKNOWN_ANALYTICS_VALUE,
    deviceModel: ua.device.model ?? UNKNOWN_ANALYTICS_VALUE,
    deviceType: ua.device.type ?? UNKNOWN_ANALYTICS_VALUE,
    deviceVendor: ua.device.vendor ?? UNKNOWN_ANALYTICS_VALUE,
    engineName: ua.engine.name ?? UNKNOWN_ANALYTICS_VALUE,
    engineVersion: ua.engine.version ?? UNKNOWN_ANALYTICS_VALUE,
    cpuArchitecture: ua.cpu.architecture ?? UNKNOWN_ANALYTICS_VALUE,
    geoCountry: req.geo?.country ?? UNKNOWN_ANALYTICS_VALUE,
    geoRegion: req.geo?.region ?? UNKNOWN_ANALYTICS_VALUE,
    geoCity: req.geo?.city ?? UNKNOWN_ANALYTICS_VALUE,
    geoLatitude: req.geo?.latitude ?? UNKNOWN_ANALYTICS_VALUE,
    geoLongitude: req.geo?.longitude ?? UNKNOWN_ANALYTICS_VALUE,
  });
}
