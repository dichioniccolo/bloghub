import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

export * from "./schema";

export * from "drizzle-orm";

// const globalForDrizzle = globalThis as {
//   db?: ReturnType<typeof drizzle<typeof schema>>;
// };

export const db =
  // globalForDrizzle.db ||
  drizzle(sql, {
    schema,
  });

// if (process.env.NODE_ENV !== "production") globalForDrizzle.db = db;
