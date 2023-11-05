"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { db, Role } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";

import { isOwnerCheck } from "~/app/_actions/schemas";
import { authenticatedAction } from "../authenticated-action";

export const deleteProject = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);
    }),
)(async ({ projectId }, { userId }) => {
  const project = await db.project.findUniqueOrThrow({
    where: {
      id: projectId,
      deletedAt: null,
      members: {
        some: {
          userId,
          roleEnum: Role.OWNER,
        },
      },
    },
    select: {
      id: true,
      domain: true,
    },
  });

  await inngest.send({
    name: "project/delete",
    data: project,
  });

  redirect(AppRoutes.Dashboard);
});
