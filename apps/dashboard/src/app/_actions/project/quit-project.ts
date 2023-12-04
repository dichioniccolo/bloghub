"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, drizzleDb, eq, schema } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { IS_NOT_OWNER_MESSAGE, isProjectMember } from "~/app/_actions/schemas";
import { RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";

export const quitProject = createServerAction({
  actionName: "quitProject",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: RequiredString,
  }),
  action: async ({ input: { projectId }, ctx: { user } }) => {
    if (!(await isProjectMember(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    await drizzleDb
      .delete(schema.projectMembers)
      .where(
        and(
          eq(schema.projectMembers.projectId, projectId),
          eq(schema.projectMembers.userId, user.id),
        ),
      );

    redirect(AppRoutes.Dashboard);
  },
});
