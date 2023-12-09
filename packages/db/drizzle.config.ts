import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
  schema: "./src/**/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  introspect: {
    casing: "camel",
  },
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
} satisfies Config;
