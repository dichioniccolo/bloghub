import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { customAlphabet } from "nanoid";

import { env } from "./env.mjs";
import * as schema from "./schema";

export * from "./schema";

export * from "drizzle-orm";

export * from "./types";

const connection = new Client({
  url: env.DATABASE_URL,
  fetch(input, init) {
    return fetch(input, {
      ...init,
      cache: "default",
    });
  },
}).connection();

export const db = drizzle(connection, {
  schema,
});

export const genId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
