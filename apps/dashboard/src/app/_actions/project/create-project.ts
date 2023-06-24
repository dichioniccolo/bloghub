"use server";

import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

import { createDomain } from "@acme/common/external/vercel";
import { AppRoutes } from "@acme/common/routes";
import { db, eq, projectMembers, projects, Role } from "@acme/db";
import { zactAuthenticated } from "@acme/zact/server";

import { $getUser } from "~/app/_api/get-user";
import { DomainSchema } from "../schemas";

export const createProject = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  () =>
    z.object({
      name: z.string().min(1),
      domain: DomainSchema,
    }),
)(async ({ name, domain }, { userId }) => {
  const project = await db.transaction(async (tx) => {
    await createDomain(domain);

    const id = createId();

    await tx.insert(projects).values({
      id,
      name,
      domain,
    });

    const project = await tx
      .select()
      .from(projects)
      .where(eq(projects.id, id))
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
