import "server-only";

import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

export * from "@prisma/client";

export { createId } from "@paralleldrive/cuid2";

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL_POSTGRES}`;

const pool = new Pool({ connectionString });

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
