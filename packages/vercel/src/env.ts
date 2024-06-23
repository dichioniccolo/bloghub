import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    VERCEL_API_URL: z.string().min(1),
    VERCEL_BEARER_TOKEN: z.string().min(1),
    VERCEL_ENABLE_DOMAIN: z
      .string()
      .regex(/true|false/)
      .transform((str) => str === "true"),
    VERCEL_PROJECT_ID: z.string().min(1),
    VERCEL_TEAM_ID: z.string().min(1),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {},
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    VERCEL_API_URL: process.env.VERCEL_API_URL,
    VERCEL_BEARER_TOKEN: process.env.VERCEL_BEARER_TOKEN,
    VERCEL_ENABLE_DOMAIN: process.env.VERCEL_ENABLE_DOMAIN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
  },

  // Client side variables gets destructured here due to Next.js static analysis
  // Shared ones are also included here for good measure since the behavior has been inconsistent
  // experimental__runtimeEnv: {
  //   NODE_ENV: process.env.NODE_ENV,
  // },
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
