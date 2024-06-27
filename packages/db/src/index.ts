import "server-only";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

import { env } from "./env";

export * from "@prisma/client/edge";

export { createId } from "@paralleldrive/cuid2";

const prismaClientSingleton = () => {
  // const pool = new Pool({ connectionString: env.DIRECT_DATABASE_URL });
  // const adapter = new PrismaNeon(pool);
  return new PrismaClient({
    // adapter,
  }).$extends(withAccelerate());
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
