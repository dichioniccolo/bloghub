import type { MetadataRoute, ServerRuntime } from "next";

import { env } from "~/env";

export const runtime: ServerRuntime = "edge";

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
