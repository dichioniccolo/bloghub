import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import { db, Role } from "@acme/db";
import { DOMAIN_REGEX } from "@acme/lib/constants";

export const DomainSchema = z
  .string({
    required_error: "Domain is required",
  })
  .regex(DOMAIN_REGEX, { message: "Invalid domain" })
  .refine(async (domain) => {
    const domainExists = await db.project.exists({
      where: {
        deletedAt: null,
        domain,
      },
    });

    return !domainExists;
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

export async function isProjectOwner(projectId: string, userId: string) {
  const isOwner = await db.projectMember.exists({
    where: {
      projectId,
      userId,
      role: Role.OWNER,
    },
  });

  return isOwner;
}

export async function isProjectMember(projectId: string, userId: string) {
  const isMember = await db.projectMember.exists({
    where: {
      projectId,
      userId,
    },
  });

  return isMember;
}
export const IS_NOT_OWNER_MESSAGE =
  "You must be the owner of the project to perform this action";

export const IS_NOT_MEMBER_MESSAGE =
  "You must be a member of the project to continue";
