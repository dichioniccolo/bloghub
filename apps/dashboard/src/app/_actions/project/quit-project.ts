"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { isProjectMember } from "~/app/_actions/schemas";
import { authenticatedAction } from "../authenticated-action";

export const quitProject = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string(),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isProjectMember(projectId, userId, ctx);
    }),
)(async ({ projectId }, { userId }) => {
  await db.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  redirect(AppRoutes.Dashboard);
});
