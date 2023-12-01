"use server";

import { drizzleDb, eq, schema } from "@acme/db";

export async function getProjectByDomain(domain: string) {
  return await drizzleDb.query.projects.findFirst({
    columns: {
      name: true,
      logo: true,
    },
    where: eq(schema.projects.domain, domain),
  });
}

export type GetProjectByDomain = Awaited<ReturnType<typeof getProjectByDomain>>;
