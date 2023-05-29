import { Client } from "@upstash/qstash/nodejs";

import "isomorphic-fetch";

import { env } from "../env.mjs";

export const qstashClient = new Client({
  token: env.QSTASH_TOKEN,
});
