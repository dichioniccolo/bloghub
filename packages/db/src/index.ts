import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

// import ws from "ws";

export { createId } from "@paralleldrive/cuid2";

const connectionString = `${process.env.DATABASE_URL_POSTGRES}`;

const pool = new Pool({
  connectionString,
});

// neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
