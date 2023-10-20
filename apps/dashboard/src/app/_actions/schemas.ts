import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import {
  and,
  db,
  eq,
  isNull,
  projectMembers,
  projects,
  Role,
  sql,
} from "@acme/db";

export const DomainSchema = z
  .string()
  .min(3)
  .refine(async (domain) => {
    const domains = await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(projects)
      .where(and(eq(projects.domain, domain), isNull(projects.deletedAt)))
      .then((x) => x[0]!);

    return domains.count === 0;
  }, "Domain already exists")
  .refine(async (domain) => {
    if (!(await has("domainBlacklist"))) {
      return true;
    }

    const blackList = await get("domainBlacklist");

    if (!Array.isArray(blackList)) {
      return true;
    }

    return !blackList.some((x) => x?.toString().includes(domain));
  }, "Domain not available");

export async function isOwnerCheck(
  projectId: string,
  userId: string,
  ctx: z.RefinementCtx,
  options?: {
    path: string[];
  },
) {
  const isOwnerCount = await db
    .select({
      count: sql<number>`count(
      ${projectMembers.userId}
      )`.mapWith(Number),
    })
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, Role.Owner),
      ),
    )
    .then((x) => x[0]!);

  if (isOwnerCount.count === 0) {
    ctx.addIssue({
      code: "custom",
      message: "You must be the owner of the project to perform this action",
      path: options?.path ?? ["projectId"],
    });
  }
}
