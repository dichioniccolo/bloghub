import type { MetadataRoute } from "next";

import { env } from "~/env.mjs";

export const runtime = "edge";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `https://${env.NEXT_PUBLIC_APP_DOMAIN}/sitemap.xml`,
  };
}
