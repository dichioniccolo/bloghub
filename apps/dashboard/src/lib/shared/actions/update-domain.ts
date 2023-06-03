"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createDomain, deleteDomain } from "@acme/common/external/vercel";
import { AppRoutes } from "@acme/common/routes";
import { prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";
import { DomainSchema } from "./schemas";

export const updateDomain = zact(
  z.object({
    projectId: z.string(),
    oldDomain: z.string(),
    newDomain: DomainSchema,
  }),
)(async ({ projectId, newDomain, oldDomain }) => {
  await deleteDomain(oldDomain);

  await createDomain(newDomain);

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      domain: newDomain,
    },
  });

  revalidatePath(AppRoutes.ProjectSettings(projectId));
});
