"use server";

import { db } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  return await db.project.findFirst({
    where: {
      deletedAt: null,
      domain,
    },
    select: {
      name: true,
      logo: true,
    },
  });
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
