import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { customAlphabet } from "nanoid";

export const db = new PrismaClient().$extends(withAccelerate()).$extends({
  name: "soft-delete",
  model: {
    project: {
      async softDelete(id: string) {
        await db.project.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
  query: {
    project: {
      findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null };

        return query(args);
      },
      findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null };

        return query(args);
      },
      findFirstOrThrow({ args, query }) {
        args.where = { ...args.where, deletedAt: null };

        return query(args);
      },
      findUnique({ args, query }) {
        args.where = { ...args.where, deletedAt: null };

        return query(args);
      },
      findUniqueOrThrow({ args, query }) {
        args.where = { ...args.where, deletedAt: null };

        return query(args);
      },
    },
  },
});

export * from "@prisma/client/edge";

export const genId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
