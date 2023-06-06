"use server";

import { z } from "zod";

import { verifyProjectDomain } from "@acme/common/external/vercel/actions";
import { and, db, eq, projectMembers, projects } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const verifyDomain = zact(
  z.object({
    userId: z.string(),
    projectId: z.string(),
  }),
)(async ({ userId, projectId }) => {
  const project = await db
    .select({
      domain: projects.domain,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, "owner"),
      ),
    )
    .then((x) => x[0]);

  if (!project) {
    throw new Error("Project not found");
  }

  return await verifyProjectDomain(project.domain);
});

export type VerifyDomain = Awaited<ReturnType<typeof verifyDomain>>;
