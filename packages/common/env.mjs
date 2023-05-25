import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    VERCEL_API_URL: z.string().min(1),
    VERCEL_BEARER_TOKEN: z.string().min(1),
    VERCEL_ENABLE_DOMAIN: z
      .string()
      .regex(/true|false/)
      .transform((str) => str === "true"),
    VERCEL_PROJECT_ID: z.string().min(1),
    VERCEL_TEAM_ID: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_PRO_10K_MONTHLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_10K_YEARLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID: z.string().min(1),
    DO_ENDPOINT: z.string().min(1),
    DO_REGION: z.string().min(1),
    DO_ACCESS_KEY: z.string().min(1),
    DO_SECRET_KEY: z.string().min(1),
    DO_BUCKET: z.string().min(1),
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
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_API_URL: process.env.VERCEL_API_URL,
    VERCEL_BEARER_TOKEN: process.env.VERCEL_BEARER_TOKEN,
    VERCEL_ENABLE_DOMAIN: process.env.VERCEL_ENABLE_DOMAIN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_PRO_10K_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_10K_MONTHLY_PLAN_ID,
    STRIPE_PRO_10K_YEARLY_PLAN_ID: process.env.STRIPE_PRO_10K_YEARLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID,
    DO_ENDPOINT: process.env.DO_ENDPOINT,
    DO_REGION: process.env.DO_REGION,
    DO_ACCESS_KEY: process.env.DO_ACCESS_KEY,
    DO_SECRET_KEY: process.env.DO_SECRET_KEY,
    DO_BUCKET: process.env.DO_BUCKET,
  },
});
