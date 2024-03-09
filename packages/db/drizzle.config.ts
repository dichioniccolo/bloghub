import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
  schema: "./src/**/schema.ts",
  out: "./drizzle",
  driver: "pg",
  introspect: {
    casing: "camel",
  },
  dbCredentials: {
    connectionString: process.env.DATABASE_URL_POSTGRES!,
  },
} satisfies Config;
