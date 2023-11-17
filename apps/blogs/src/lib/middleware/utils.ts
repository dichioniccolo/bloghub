import type { NextRequest } from "next/server";
import { userAgent } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { ipAddress } from "@vercel/edge";
import { kv } from "@vercel/kv";

import { db } from "@acme/db";
import { SELF_REFERER } from "@acme/lib/constants";
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

  const post = await db.post.findFirst({
    where: {
      // Only not hidden posts
      hidden: false,
      project: {
        deletedAt: null,
        domain,
      },
      slug,
    },
    select: {
      id: true,
      projectId: true,
    },
  });

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

  await db.visit.create({
    data: {
      projectId: post.projectId,
      postId: post.id,
      referer: refererDomain ?? SELF_REFERER,
      browserName: ua.browser.name ?? "Unknown",
      browserVersion: ua.browser.version ?? "Unknown",
      osName: ua.os.name ?? "Unknown",
      osVersion: ua.os.version ?? "Unknown",
      deviceModel: ua.device.model ?? "Unknown",
      deviceType: ua.device.type ?? "Unknown",
      deviceVendor: ua.device.vendor ?? "Unknown",
      engineName: ua.engine.name ?? "Unknown",
      engineVersion: ua.engine.version ?? "Unknown",
      cpuArchitecture: ua.cpu.architecture ?? "Unknown",
      geoCountry: req.geo?.country ?? "Unknown",
      geoRegion: req.geo?.region ?? "Unknown",
      geoCity: req.geo?.city ?? "Unknown",
      geoLatitude: req.geo?.latitude ?? "Unknown",
      geoLongitude: req.geo?.longitude ?? "Unknown",
    },
  });
}
