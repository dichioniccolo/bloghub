"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";
import { isProjectOwner } from "../schemas";

export const updateProjectName = createServerAction({
  actionName: "updateProjectName",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string().min(1),
    name: z.string().min(1),
  }),
  action: async ({ input: { projectId, name }, ctx: { user } }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(
        "You must be the owner of the project to perform this action",
      );
    }

    await db.project.update({
      where: {
        id: projectId,
        deletedAt: null,
      },
      data: {
        name,
      },
    });

    revalidatePath(`/projects/${projectId}`);
  },
});
