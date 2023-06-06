import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { env } from "./env.mjs";
import * as schema from "./schema";

export * from "./schema";

export * from "./types";

export * from "drizzle-orm";

export const db = drizzle(sql, {
  schema,
  logger: env.NODE_ENV === "development",
});
