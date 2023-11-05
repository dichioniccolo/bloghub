"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";
import { isOwnerCheck } from "../schemas";

export const updateProjectName = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      name: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);
    }),
)(async ({ projectId, name }) => {
  await db.project.update({
    where: {
      id: projectId,
      deletedAt: null,
    },
    data: {
      name,
    },
  });

  revalidatePath(`/projects/${projectId}`);
});
