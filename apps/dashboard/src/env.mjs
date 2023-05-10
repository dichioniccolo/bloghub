import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    POSTMARK_API_KEY: z.string().min(1),
    POSTMARK_BROADCAST_ACCESS_KEY: z.string().min(1),
    POSTMARK_BROADCAST_SECRET_KEY: z.string().min(1),
    POSTMARK_FROM: z.preprocess(
      // get from the string the value between the < and > characters
      (str) => (typeof str === "string" ? str.match(/<(.*)>/)?.[1] : null),
      z.string().email(),
    ),
    NEXTAUTH_SECRET: z.string().min(1),
    VERCEL_BEARER_TOKEN: z.string().min(1),
    VERCEL_PROJECT_ID: z.string().min(1),
    VERCEL_TEAM_ID: z.string().min(1),
    VERCEL_API_URL: z.string().min(1),
    VERCEL_ENABLE_DOMAIN: z
      .string()
      .regex(/true|false/)
      .transform((str) => str === "true"),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
    POSTMARK_BROADCAST_ACCESS_KEY: process.env.POSTMARK_BROADCAST_ACCESS_KEY,
    POSTMARK_BROADCAST_SECRET_KEY: process.env.POSTMARK_BROADCAST_SECRET_KEY,
    POSTMARK_FROM: process.env.POSTMARK_FROM,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    VERCEL_BEARER_TOKEN: process.env.VERCEL_BEARER_TOKEN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    VERCEL_API_URL: process.env.VERCEL_API_URL,
    VERCEL_ENABLE_DOMAIN: process.env.VERCEL_ENABLE_DOMAIN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
