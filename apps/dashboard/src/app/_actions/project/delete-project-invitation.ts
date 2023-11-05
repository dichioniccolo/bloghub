"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { isOwnerCheck } from "~/app/_actions/schemas";
import { authenticatedAction } from "../authenticated-action";

export const deleteProjectInvitation = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      email: z.string().email(),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);
    }),
)(async ({ projectId, email }) => {
  await db.projectInvitation.delete({
    where: {
      email_projectId: {
        email,
        projectId,
      },
    },
    select: {
      project: {
        select: {
          name: true,
        },
      },
    },
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
