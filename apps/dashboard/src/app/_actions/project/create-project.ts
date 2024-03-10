"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Projects } from "@acme/db";
import { prisma } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { createServerAction } from "@acme/server-actions/server";
import { createDomain } from "@acme/vercel";

import { authenticatedMiddlewares } from "~/app/_actions/middlewares/user";
import { DomainSchema } from "../schemas";

export const createProject = createServerAction({
  actionName: "createProject",
  middlewares: authenticatedMiddlewares,
  initialState: undefined as unknown as Projects,
  schema: z.object({
    name: z.string().min(1),
    domain: DomainSchema,
  }),
  action: async ({ input: { name, domain }, ctx }) => {
    const { user } = ctx;

    const project = await prisma.$transaction(async (tx) => {
      await createDomain(domain);

      const project = await tx.projects.create({
        data: {
          name,
          domain,
          members: {
            create: {
              userId: user.id,
              role: "OWNER",
            },
          },
        },
      });

      return project;
    });

    revalidatePath(AppRoutes.Dashboard);

    return project;
  },
});
