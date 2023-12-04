"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Project } from "@acme/db";
import { createId, db, eq, schema } from "@acme/db";
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

    const project = await db.transaction(async (tx) => {
      await createDomain(domain);

      const id = createId();

      await tx.insert(schema.projects).values({
        id,
        name,
        domain,
        updatedAt: new Date(),
      });

      await tx.insert(schema.projectMembers).values({
        projectId: id,
        userId: user.id,
        role: "OWNER",
      });

      return await tx.query.projects.findFirst({
        where: eq(schema.projects.id, id),
      });
    });

    revalidatePath(AppRoutes.Dashboard);

    return project;
  },
});
