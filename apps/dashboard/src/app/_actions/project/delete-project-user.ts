"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import { IS_NOT_OWNER_MESSAGE, isProjectOwner } from "../schemas";

export const deleteProjectUser = createServerAction({
  actionName: "deleteProjectUser",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: RequiredString,
    userId: RequiredString,
  }),
  action: async ({
    input: { projectId, userId: userIdToDelete },
    ctx: { user },
  }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    const userToDelete = await prisma.projectMembers.findFirst({
      where: {
        projectId,
        userId: userIdToDelete,
      },
      select: {
        role: true,
        user: {
          select: {
            email: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!userToDelete) {
      return;
    }

    if (userToDelete?.role === "OWNER") {
      throw new ErrorForClient("Cannot delete owner");
    }

    await prisma.projectMembers.delete({
      where: {
        projectId_userId: {
          projectId,
          userId: userIdToDelete,
        },
      },
    });

    await inngest.send({
      id: `notification/project.user.removed/${projectId}-${userToDelete.user.email}`,
      name: "notification/project.user.removed",
      data: {
        projectName: userToDelete.project.name,
        userEmail: userToDelete.user.email,
      },
    });

    revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
  },
});
