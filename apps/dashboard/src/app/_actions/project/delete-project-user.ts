"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { and, drizzleDb, eq, schema } from "@acme/db";
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

    const userToDelete = await drizzleDb.query.projectMembers.findFirst({
      where: and(
        eq(schema.projectMembers.projectId, projectId),
        eq(schema.projectMembers.userId, userIdToDelete),
      ),
      columns: {
        role: true,
      },
      with: {
        user: {
          columns: {
            email: true,
          },
        },
        project: {
          columns: {
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

    await drizzleDb
      .delete(schema.projectMembers)
      .where(
        and(
          eq(schema.projectMembers.projectId, projectId),
          eq(schema.projectMembers.userId, userIdToDelete),
        ),
      );

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
