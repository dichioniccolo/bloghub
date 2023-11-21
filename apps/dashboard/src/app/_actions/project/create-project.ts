"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Project } from "@acme/db";
import { db, Role } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { createServerAction } from "@acme/server-actions/server";
import { createDomain } from "@acme/vercel";

import { getCurrentUser } from "~/app/_api/get-user";
import { DomainSchema } from "../schemas";

export const createProject = createServerAction({
  schema: z.object({
    name: z.string().min(1),
    domain: DomainSchema,
  }),
  initialState: undefined as unknown as Project,
  middlewares: [
    async () => {
      const user = await getCurrentUser();
      return {
        userId: user.id,
        userEmail: user.email,
      };
    },
  ],
  action: async ({ input: { name, domain }, ctx }) => {
    const { userId } = ctx[0];

    const project = await db.$transaction(async (tx) => {
      await createDomain(domain);

      return await tx.project.create({
        data: {
          name,
          domain,
          members: {
            create: {
              userId,
              role: Role.OWNER,
            },
          },
        },
      });
    });

    revalidatePath(AppRoutes.Dashboard);

    return project;
  },
});

// export const createProject = authenticatedAction(() =>
//   z.object({
//     name: z.string().min(1),
//     domain: DomainSchema,
//   }),
// )(async ({ name, domain }, { userId }) => {
//   const project = await db.$transaction(async (tx) => {
//     await createDomain(domain);

//     return await tx.project.create({
//       data: {
//         name,
//         domain,
//         members: {
//           create: {
//             userId,
//             role: Role.OWNER,
//           },
//         },
//       },
//     });
//   });

//   revalidatePath(AppRoutes.Dashboard);

//   return project;
// });
