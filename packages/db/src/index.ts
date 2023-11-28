import { Client } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "./env.mjs";
import { account, accountRelations } from "./schema/account/schema";
import {
  automaticEmails,
  automaticEmailsRelations,
} from "./schema/automaticEmails/schema";
import {
  emailNotificationSettings,
  emailNotificationSettingsRelations,
} from "./schema/emailNotificationSettings/schema";
import { likes, likesRelations } from "./schema/likes/schema";
import { media, mediaRelations } from "./schema/media/schema";
import {
  notifications,
  notificationsRelations,
} from "./schema/notifications/schema";
import { posts, postsRelations } from "./schema/posts/schema";
import {
  projectInvitations,
  projectInvitationsRelations,
} from "./schema/projectInvitations/schema";
import {
  projectMembers,
  projectMembersRelations,
} from "./schema/projectMembers/schema";
import { projects, projectsRelations } from "./schema/projects/schema";
import { session, sessionRelations } from "./schema/session/schema";
import { user, userRelations } from "./schema/user/schema";
import { verificationToken } from "./schema/verificationToken/schema";
import { visits, visitsRelations } from "./schema/visits/schema";

const drizzleDbClient = new Client({
  url: env.DRIZZLE_DATABASE_URL,
});

export const schema = {
  account,
  accountRelations,

  automaticEmails,
  automaticEmailsRelations,

  emailNotificationSettings,
  emailNotificationSettingsRelations,

  likes,
  likesRelations,

  media,
  mediaRelations,

  notifications,
  notificationsRelations,

  posts,
  postsRelations,

  projectInvitations,
  projectInvitationsRelations,

  projectMembers,
  projectMembersRelations,

  projects,
  projectsRelations,

  session,
  sessionRelations,

  user,
  userRelations,

  verificationToken,

  visits,
  visitsRelations,
};

export const drizzleDb = drizzle(drizzleDbClient.connection(), {
  schema,
});

const prismaDbClient = new Client({
  url: env.DATABASE_URL,
});

const adapter = new PrismaPlanetScale(prismaDbClient);

export const db = new PrismaClient({
  adapter,
})
  .$extends(withAccelerate())
  .$extends({
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
  })
  .$extends({
    name: "exists",
    model: {
      $allModels: {
        async exists<T>(
          this: T,
          options: { where: Prisma.Args<T, "count">["where"] },
        ): Promise<boolean> {
          // Get the current model at runtime
          const context = Prisma.getExtensionContext(this);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          const result = await (context as any).count({ where: options.where });

          return result > 0;
        },
      },
    },
  });
// .$extends({
//   name: "pagination",
//   model: {
//     $allModels: {
//       async paginate<T>(
//         this: T,
//         options: Omit<Prisma.Args<T, "findMany">, "skip" | "take"> & {
//           page: number;
//           pageSize: number;
//         },
//       ) {
//         // Get the current model at runtime
//         const context = Prisma.getExtensionContext(this);

//         const { page, pageSize, ...rest } = options;

//         const skip = page * pageSize;

//         const data = await (context as any).findMany({
//           ...rest,
//           skip,
//           take: pageSize,
//         });

//         const count = await (context as any).count({ ...rest });

//         return {
//           data: data as T[],
//           count: count as number,
//         };
//       },
//     },
//   },
// });
// .$extends({
//   name: "owner",
//   result: {
//     project: {
//       owner: {
//         needs: {
//           id: true,
//         },
//         compute({ id }) {
//           return () =>
//             db.projectMember.findFirstOrThrow({
//               where: {
//                 projectId: id,
//                 role: Role.OWNER,
//               },
//             });
//         },
//       },
//     },
//   },
// });

export * from "@prisma/client/edge";

export { createId } from "@paralleldrive/cuid2";
