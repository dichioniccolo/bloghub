import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";
import * as schema from "./schema";

export * from "./schema";

export * from "drizzle-orm";

export * from "./lib/drizzle-adapter";

const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
});

export const db = drizzle(connection, {
  schema,
});
