"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@acme/db";
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

    const project = await prisma.projects.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        domain: true,
      },
    });

    if (!project) {
      throw new ErrorForClient("Project not found");
    }

    await inngest.send({
      name: "project/delete",
      data: project,
    });

    redirect(AppRoutes.Dashboard);
  },
});
