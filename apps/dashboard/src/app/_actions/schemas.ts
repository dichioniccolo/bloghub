import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import { db, Role } from "@acme/db";

export const DomainSchema = z
  .string()
  .min(3)
  .refine(async (domain) => {
    const count = await db.project.count({
      where: {
        deletedAt: null,
        domain,
      },
    });

    return count === 0;
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
  const count = await db.projectMember.count({
    where: {
      projectId,
      userId,
      role: Role.OWNER,
    },
  });

  if (count === 0) {
    ctx.addIssue({
      code: "custom",
      message: "You must be the owner of the project to perform this action",
      path: options?.path ?? ["projectId"],
    });
  }
}

export async function isProjectMember(
  projectId: string,
  userId: string,
  ctx: z.RefinementCtx,
  options?: {
    path: string[];
  },
) {
  const count = await db.projectMember.count({
    where: {
      projectId,
      userId,
    },
  });

  if (count === 0) {
    ctx.addIssue({
      code: "custom",
      message: "You must be a member of the project",
      path: options?.path ?? ["projectId"],
    });
  }
}
