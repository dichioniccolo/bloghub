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
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
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
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_PRO_50K_MONTHLY_PLAN_ID: process.env.STRIPE_PRO_50K_MONTHLY_PLAN_ID,
    STRIPE_PRO_50K_YEARLY_PLAN_ID: process.env.STRIPE_PRO_50K_YEARLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_MONTHLY_PLAN_ID,
    STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID:
      process.env.STRIPE_PRO_UNLIMITED_YEARLY_PLAN_ID,
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
