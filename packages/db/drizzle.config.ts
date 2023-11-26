import type { Config } from "drizzle-kit";

export default {
  schema: "./src/**/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  introspect: {
    casing: "camel",
  },
  dbCredentials: {
    uri: process.env.DRIZZLE_DATABASE_URL!,
  },
} satisfies Config;
