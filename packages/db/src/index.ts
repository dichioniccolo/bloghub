import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { customAlphabet } from "nanoid";

import { env } from "./env.mjs";
import * as schema from "./schema";

export * from "./schema";

export * from "drizzle-orm";

export * from "./types";

export * from "./lib/drizzle-adapter";

const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  fetch(input, init) {
    return fetch(input, {
      ...init,
      cache: "default",
    });
  },
});

export const db = drizzle(connection, {
  schema,
});

export const genId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
