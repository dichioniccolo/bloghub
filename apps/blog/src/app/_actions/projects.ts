"use server";

import { db, eq, projects } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  return await db
    .select({
      name: projects.name,
      logo: projects.logo,
    })
    .from(projects)
    .where(eq(projects.domain, domain))
    .then((x) => x[0]);
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
