"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";
import { isOwnerCheck } from "../schemas";

export const updateProjectLogo = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      logo: z.string().optional().nullable(),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);
    }),
)(async ({ projectId, logo }) => {
  await db.project.update({
    where: {
      id: projectId,
      deletedAt: null,
    },
    data: {
      logo,
    },
  });

  revalidatePath(`/projects/${projectId}`);
});
