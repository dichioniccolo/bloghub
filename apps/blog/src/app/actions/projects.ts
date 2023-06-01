"use server";

import { prisma } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  const project = await prisma.project.findUnique({
    where: {
      domain,
    },
    select: {
      name: true,
    },
  });

  return project;
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
