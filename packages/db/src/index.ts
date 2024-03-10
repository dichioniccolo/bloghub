import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// import ws from "ws";

export { createId } from "@paralleldrive/cuid2";

const connectionString = `${process.env.DATABASE_URL_POSTGRES}`;

const pool = new Pool({
  connectionString,
});

// neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });

export * from "@prisma/client";
