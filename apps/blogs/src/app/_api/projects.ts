"use server";

import { prisma } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  return await prisma.projects.findFirst({
    where: {
      domain,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      socials: {
        select: {
          social: true,
          value: true,
        },
      },
    },
  });
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
