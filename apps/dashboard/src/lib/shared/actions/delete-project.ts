"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { deleteProject as deleteProjectBase } from "@acme/common/actions";
import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, projectMembers, projects } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const deleteProject = zact(
  z.object({
    userId: z.string(),
    projectId: z.string(),
  }),
)(async ({ userId, projectId }) => {
  const project = await db
    .select({
      id: projects.id,
      domain: projects.domain,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .innerJoin(
      projectMembers,
      and(eq(projectMembers.userId, userId), eq(projectMembers.role, "owner")),
    )
    .then((x) => x[0]);

  if (!project) {
    throw new Error("Project not found");
  }

  await deleteProjectBase(project);

  revalidatePath(AppRoutes.Dashboard);
  redirect(AppRoutes.Dashboard);
});
