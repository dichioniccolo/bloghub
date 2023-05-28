import { Client } from "@upstash/qstash/nodejs";

import { env } from "~/env.mjs";

export const qstashClient = new Client({
  token: env.QSTASH_TOKEN,
});

// const res = await c.publishJSON({
//   url: "https://my-api...",
//   // or topic: "the name or id of a topic"
//   body: {
//     hello: "world",
//   },
// });
