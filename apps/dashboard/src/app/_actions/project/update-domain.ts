"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { createDomain, deleteDomain } from "@acme/vercel";

import { authenticatedAction } from "../authenticated-action";
import { DomainSchema, isOwnerCheck } from "../schemas";

export const updateDomain = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      newDomain: DomainSchema,
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);
    }),
)(async ({ projectId, newDomain }) => {
  const project = await db.project.findUniqueOrThrow({
    where: {
      id: projectId,
      deletedAt: null,
    },
    select: {
      domain: true,
    },
  });

  await deleteDomain(project.domain);
  await createDomain(newDomain);

  await db.project.update({
    where: {
      id: projectId,
      deletedAt: null,
    },
    data: {
      domain: newDomain,
    },
  });

  revalidatePath(AppRoutes.ProjectSettings(projectId));
});
