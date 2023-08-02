import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_PRO_50K_MONTHLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_50K_YEARLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID: z.string().min(1),
    DO_ENDPOINT: z.string().min(1),
    DO_REGION: z.string().min(1),
    DO_ACCESS_KEY: z.string().min(1),
    DO_SECRET_KEY: z.string().min(1),
    DO_BUCKET: z.string().min(1),
    DO_CDN_URL: z.string().min(1),
    EDGE_CONFIG: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    VERCEL_API_URL: z.string().min(1),
    VERCEL_BEARER_TOKEN: z.string().min(1),
    VERCEL_ENABLE_DOMAIN: z
      .string()
      .regex(/true|false/)
      .transform((str) => str === "true"),
    VERCEL_PROJECT_ID: z.string().min(1),
    VERCEL_TEAM_ID: z.string().min(1),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    NEXTAUTH_SECRET: z.string().min(1),
    QSTASH_TOKEN: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    KV_URL: z.string().url(),
    KV_REST_API_URL: z.string().url(),
    KV_REST_API_TOKEN: z.string().min(1),
    KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
    QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_SECRET: z.string().min(1),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_APP_DESCRIPTION: z.string().min(1),
    NEXT_PUBLIC_APP_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_PUSHER_KEY: z.string().min(1),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    EDGE_CONFIG: process.env.EDGE_CONFIG,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_API_URL: process.env.VERCEL_API_URL,
    VERCEL_BEARER_TOKEN: process.env.VERCEL_BEARER_TOKEN,
    VERCEL_ENABLE_DOMAIN: process.env.VERCEL_ENABLE_DOMAIN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    QSTASH_TOKEN: process.env.QSTASH_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_PRO_50K_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_50K_MONTHLY_PLAN_ID,
    STRIPE_PRO_50K_YEARLY_PLAN_ID: process.env.STRIPE_PRO_50K_YEARLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID,
    DO_ENDPOINT: process.env.DO_ENDPOINT,
    DO_REGION: process.env.DO_REGION,
    DO_ACCESS_KEY: process.env.DO_ACCESS_KEY,
    DO_SECRET_KEY: process.env.DO_SECRET_KEY,
    DO_BUCKET: process.env.DO_BUCKET,
    DO_CDN_URL: process.env.DO_CDN_URL,
  },
});
