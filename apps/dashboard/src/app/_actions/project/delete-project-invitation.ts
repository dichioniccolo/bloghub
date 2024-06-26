"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { IS_NOT_OWNER_MESSAGE, isProjectOwner } from "~/app/_actions/schemas";
import { RequiredEmail, RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";

export const deleteProjectInvitation = createServerAction({
  actionName: "deleteProjectInvitation",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: RequiredString,
    email: RequiredEmail,
  }),
  action: async ({ input: { projectId, email }, ctx: { user } }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    await prisma.projectInvitations.delete({
      where: {
        email_projectId: {
          projectId,
          email,
        },
      },
    });

    revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
  },
});
