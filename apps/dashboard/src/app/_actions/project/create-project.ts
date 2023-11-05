"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db, Role } from "@acme/db";
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
  const project = await db.$transaction(async (tx) => {
    await createDomain(domain);

    return await tx.project.create({
      data: {
        name,
        domain,
        members: {
          create: {
            userId,
            role: Role.OWNER,
          },
        },
      },
    });
  });

  revalidatePath(AppRoutes.Dashboard);

  return project;
});
