import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().min(1).transform(Number),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM: z.preprocess(
      // get from the string the value between the < and > characters
      (str) => (typeof str === "string" ? str.match(/<(.*)>/)?.[1] : null),
      z.string().email(),
    ),
    SMTP_BROADCAST_HOST: z.string().min(1),
    SMTP_BROADCAST_PORT: z.string().min(1).transform(Number),
    SMTP_BROADCAST_ACCESS_KEY: z.string().min(1),
    SMTP_BROADCAST_SECRET_KEY: z.string().min(1),
    APP_BASE_URL: z.string().url(),
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
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_BROADCAST_HOST: process.env.SMTP_BROADCAST_HOST,
    SMTP_BROADCAST_PORT: process.env.SMTP_BROADCAST_PORT,
    SMTP_BROADCAST_ACCESS_KEY: process.env.SMTP_BROADCAST_ACCESS_KEY,
    SMTP_BROADCAST_SECRET_KEY: process.env.SMTP_BROADCAST_SECRET_KEY,
    APP_BASE_URL: process.env.APP_BASE_URL,
  },
});
