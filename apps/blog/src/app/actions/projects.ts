"use server";

import { db, eq, projects } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  const project = await db
    .select({
      name: projects.name,
      logo: projects.logo,
    })
    .from(projects)
    .where(eq(projects.domain, domain))
    .then((x) => x[0]);

  return project;
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
