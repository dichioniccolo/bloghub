"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@acme/db";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_OWNER_MESSAGE, isProjectOwner } from "../schemas";

export const updateProjectLogo = createServerAction({
  actionName: "updateProjectLogo",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string().min(1),
    logo: z.string().optional().nullable(),
  }),
  action: async ({ input: { projectId, logo }, ctx: { user } }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    await prisma.projects.update({
      where: {
        id: projectId,
      },
      data: {
        logo,
      },
    });

    revalidatePath(`/projects/${projectId}`);
  },
});
