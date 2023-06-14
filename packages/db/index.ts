import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

export * from "./schema";

export * from "drizzle-orm";

export const db = drizzle(sql, {
  schema,
  logger: false, //env.NODE_ENV === "development",
});
