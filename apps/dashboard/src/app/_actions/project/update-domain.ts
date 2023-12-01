"use server";

import { revalidatePath } from "next/cache";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";
import { createDomain, deleteDomain } from "@acme/vercel";

import { RequiredString, UpdateDomainSchema } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_OWNER_MESSAGE, isProjectOwner } from "../schemas";

export const updateDomain = createServerAction({
  actionName: "updateDomain",
  middlewares: authenticatedMiddlewares,
  schema: UpdateDomainSchema.extend({
    projectId: RequiredString,
  }),
  action: async ({ input: { projectId, newDomain }, ctx: { user } }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    const project = await db.project.findUniqueOrThrow({
      where: {
        id: projectId,
        deletedAt: null,
      },
      select: {
        domain: true,
      },
    });

    await deleteDomain(project.domain);
    await createDomain(newDomain);

    await db.project.update({
      where: {
        id: projectId,
        deletedAt: null,
      },
      data: {
        domain: newDomain,
      },
    });

    revalidatePath(AppRoutes.ProjectSettings(projectId));
  },
});
