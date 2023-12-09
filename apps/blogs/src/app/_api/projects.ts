"use server";

import { db, eq, schema } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  return await db.query.projects.findFirst({
    columns: {
      id: true,
      name: true,
      logo: true,
    },
    where: eq(schema.projects.domain, domain),
  });
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
