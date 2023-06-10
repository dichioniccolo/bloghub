"use server";

import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { createDomain } from "@acme/common/external/vercel";
import { AppRoutes } from "@acme/common/routes";
import { db, projectMembers, projects } from "@acme/db";

import { zact } from "~/lib/zact/server";
import { DomainSchema } from "../schemas";

export const createProject = zact(
  z.object({
    userId: z.string().nonempty(),
    name: z.string().min(1),
    domain: DomainSchema,
  }),
)(async (input) => {
  const { userId, name, domain } = input;

  const project = await db.transaction(async (tx) => {
    await createDomain(domain);

    const project = await tx
      .insert(projects)
      .values({
        id: createId(),
        name,
        domain,
      })
      .returning()
      .then((x) => x[0]!);

    await tx.insert(projectMembers).values({
      projectId: project.id,
      userId,
      role: "owner",
    });

    return project;
  });

  revalidatePath(AppRoutes.Dashboard);

  return project;
});
