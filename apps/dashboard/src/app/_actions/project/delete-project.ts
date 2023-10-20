"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { and, db, eq, isNull, projectMembers, projects, Role } from "@acme/db";
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
  const project = await db
    .select({
      id: projects.id,
      domain: projects.domain,
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
    .innerJoin(
      projectMembers,
      and(
        eq(projects.id, projectMembers.projectId),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, Role.Owner),
      ),
    )
    .then((x) => x[0]!);

  await inngest.send({
    name: "project/delete",
    data: project,
  });

  redirect(AppRoutes.Dashboard);
});
