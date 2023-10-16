"use server";

import { and, db, eq, isNull, projects } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  return await db
    .select({
      name: projects.name,
      logo: projects.logo,
    })
    .from(projects)
    .where(and(eq(projects.domain, domain), isNull(projects.deletedAt)))
    .then((x) => x[0]);
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
