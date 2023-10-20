"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, db, eq, projectMembers } from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import { isOwnerCheck } from "~/app/_actions/schemas";
import { authenticatedAction } from "../authenticated-action";

export const quitProject = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string(),
    })
    .superRefine(async ({ projectId }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);
    }),
)(async ({ projectId }, { userId }) => {
  await db
    .delete(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    );

  redirect(AppRoutes.Dashboard);
});
