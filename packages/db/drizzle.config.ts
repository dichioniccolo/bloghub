import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
  schema: "./schema.ts",
  out: "./drizzle",
  connectionString: process.env.POSTGRES_URL,
} satisfies Config;
