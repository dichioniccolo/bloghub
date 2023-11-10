import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  dropdown: protectedProcedure.query(({ ctx: { db, session } }) => {
    return db.project.findMany({
      where: {
        deletedAt: null,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
      },
    });
  }),

  findMany: protectedProcedure.query(({ ctx: { db, session } }) => {
    return db.project.findMany({
      where: {
        deletedAt: null,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
        domain: true,
        domainVerified: true,
        _count: {
          select: {
            posts: true,
            visits: true,
          },
        },
      },
    });
  }),
});
