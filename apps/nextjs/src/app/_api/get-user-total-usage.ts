"use server";

import {
  and,
  db,
  eq,
  gte,
  lte,
  projectMembers,
  projects,
  Role,
  sql,
  visits,
} from "@acme/db";

export async function getUserTotalUsage(userId: string, from: Date, to: Date) {
  const visit = await db
    .select({
      count: sql<number>`count(${visits.id})`.mapWith(Number),
    })
    .from(visits)
    .where(and(gte(visits.createdAt, from), lte(visits.createdAt, to)))
    .innerJoin(projects, eq(projects.id, visits.projectId))
    .innerJoin(
      projectMembers,
      and(
        eq(projectMembers.projectId, projects.id),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, Role.Owner),
      ),
    )
    .then((x) => x[0]!);

  return visit.count;
}
