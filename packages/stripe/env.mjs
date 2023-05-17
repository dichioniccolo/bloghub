import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_PRO_10K_MONTHLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_10K_YEARLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID: z.string().min(1),
    STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID: z.string().min(1),
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
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_PRO_10K_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_10K_MONTHLY_PLAN_ID,
    STRIPE_PRO_10K_YEARLY_PLAN_ID: process.env.STRIPE_PRO_10K_YEARLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID,
  },
});
