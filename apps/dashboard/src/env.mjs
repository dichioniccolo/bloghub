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
    CLERK_SECRET_KEY: z.string().min(1),
    POSTMARK_API_KEY: z.string().min(1),
    POSTMARK_BROADCAST_ACCESS_KEY: z.string().min(1),
    POSTMARK_BROADCAST_SECRET_KEY: z.string().min(1),
    POSTMARK_FROM: z.string().min(1),
  },
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
    POSTMARK_BROADCAST_ACCESS_KEY: process.env.POSTMARK_BROADCAST_ACCESS_KEY,
    POSTMARK_BROADCAST_SECRET_KEY: process.env.POSTMARK_BROADCAST_SECRET_KEY,
    POSTMARK_FROM: process.env.POSTMARK_FROM,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
