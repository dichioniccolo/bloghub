import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: {
    POSTMARK_API_KEY: z.string().min(1),
    POSTMARK_FROM: z.preprocess(
      // get from the string the value between the < and > characters
      (str) => (typeof str === "string" ? str.match(/<(.*)>/)?.[1] : null),
      z.string().email(),
    ),
    ICLOUD_EMAIL: z.string().email(),
    ICLOUD_PASSWORD: z.string().min(1),
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
    POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
    POSTMARK_FROM: process.env.POSTMARK_FROM,
    ICLOUD_EMAIL: process.env.ICLOUD_EMAIL,
    ICLOUD_PASSWORD: process.env.ICLOUD_PASSWORD,
  },
});
