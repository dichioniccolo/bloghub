"use server";

import {
  and,
  count,
  db,
  eq,
  exists,
  gte,
  lte,
  schema,
  withCount,
} from "@acme/db";

export async function getUserTotalUsage(userId: string, from: Date, to: Date) {
  return await withCount(
    schema.visits,
    and(
      gte(schema.visits.createdAt, from),
      lte(schema.visits.createdAt, to),
      exists(
        db
          .select({
            count: count(),
          })
          .from(schema.projectMembers)
          .where(
            and(
              eq(schema.projectMembers.projectId, schema.visits.projectId),
              eq(schema.projectMembers.userId, userId),
              eq(schema.projectMembers.role, "OWNER"),
            ),
          ),
      ),
    ),
  );
}
