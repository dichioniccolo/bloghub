import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  out: "./drizzle",
  schema: "./src/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
