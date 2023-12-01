"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Project } from "@acme/db";
import { db, Role } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { createServerAction } from "@acme/server-actions/server";
import { createDomain } from "@acme/vercel";

import { authenticatedMiddlewares } from "~/app/_actions/middlewares/user";
import { DomainSchema } from "../schemas";

export const createProject = createServerAction({
  actionName: "createProject",
  middlewares: authenticatedMiddlewares,
  initialState: undefined as unknown as Project,
  schema: z.object({
    name: z.string().min(1),
    domain: DomainSchema,
  }),
  action: async ({ input: { name, domain }, ctx }) => {
    const { user } = ctx;

    const project = await db.$transaction(async (tx) => {
      await createDomain(domain);

      return await tx.project.create({
        data: {
          name,
          domain,
          members: {
            create: {
              userId: user.id,
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
