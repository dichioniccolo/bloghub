"use server";

import { z } from "zod";

import { db, Role } from "@acme/db";

import { isOwnerCheck } from "~/app/_actions/schemas";
import { authenticatedAction } from "../authenticated-action";
import { verifyProjectDomain } from "./verify-project-domain";

export const verifyDomain = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string(),
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
      domain: true,
    },
  });

  return await verifyProjectDomain(project.domain);
});

export type VerifyDomain = Awaited<ReturnType<typeof verifyProjectDomain>>;
