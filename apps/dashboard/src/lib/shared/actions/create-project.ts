"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createDomain } from "@acme/common/external/vercel";
import { AppRoutes } from "@acme/common/routes";
import { prisma, Role } from "@acme/db";

import { zact } from "../../zact/server";
import { DomainSchema } from "./schemas";

export const createProject = zact(
  z.object({
    userId: z.string(),
    name: z.string().min(3),
    domain: DomainSchema,
  }),
)(async (input) => {
  const { userId, name, domain } = input;

  await createDomain(domain);

  const project = await prisma.project.create({
    data: {
      name,
      domain,
      users: {
        create: {
          role: Role.OWNER,
          userId,
        },
      },
    },
  });

  revalidatePath(AppRoutes.Dashboard);

  return project;
});
