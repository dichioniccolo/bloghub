import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DO_ENDPOINT: z.string().min(1),
    DO_REGION: z.string().min(1),
    DO_ACCESS_KEY: z.string().min(1),
    DO_SECRET_KEY: z.string().min(1),
    DO_BUCKET: z.string().min(1),
    DO_CDN_URL: z.string().min(1),
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
    DO_ENDPOINT: process.env.DO_ENDPOINT,
    DO_REGION: process.env.DO_REGION,
    DO_ACCESS_KEY: process.env.DO_ACCESS_KEY,
    DO_SECRET_KEY: process.env.DO_SECRET_KEY,
    DO_BUCKET: process.env.DO_BUCKET,
    DO_CDN_URL: process.env.DO_CDN_URL,
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
