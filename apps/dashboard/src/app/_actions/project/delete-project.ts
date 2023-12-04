"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db, eq, schema } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { IS_NOT_OWNER_MESSAGE, isProjectOwner } from "~/app/_actions/schemas";
import { authenticatedMiddlewares } from "../middlewares/user";

export const deleteProject = createServerAction({
  actionName: "deleteProject",
  middlewares: authenticatedMiddlewares,
  schema: z.object({
    projectId: z.string().min(1),
  }),
  action: async ({ input: { projectId }, ctx: { user } }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    const project = await db.query.projects.findFirst({
      where: eq(schema.projects.id, projectId),
      columns: {
        id: true,
        domain: true,
      },
    });

    await inngest.send({
      name: "project/delete",
      data: project,
    });

    redirect(AppRoutes.Dashboard);
  },
});
