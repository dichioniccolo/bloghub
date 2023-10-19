"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  and,
  db,
  eq,
  genId,
  isNull,
  projectMembers,
  projects,
  Role,
} from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";
import { createDomain } from "@acme/vercel";

import { authenticatedAction } from "../authenticated-action";
import { DomainSchema } from "../schemas";

export const createProject = authenticatedAction(() =>
  z.object({
    name: z.string().min(1),
    domain: DomainSchema,
  }),
)(async ({ name, domain }, { userId }) => {
  const project = await db.transaction(async (tx) => {
    await createDomain(domain);

    const id = genId();

    await tx.insert(projects).values({
      id,
      name,
      domain,
    });

    const project = await tx
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .then((x) => x[0]!);

    await tx.insert(projectMembers).values({
      projectId: project.id,
      userId,
      role: Role.Owner,
    });

    return project;
  });

  revalidatePath(AppRoutes.Dashboard);

  return project;
});
