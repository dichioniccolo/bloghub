import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import { prisma } from "@acme/db";
import { DOMAIN_REGEX } from "@acme/lib/constants";

export const DomainSchema = z
  .string({
    required_error: "Domain is required",
  })
  .regex(DOMAIN_REGEX, { message: "Invalid domain" })
  .refine(async (domain) => {
    const existingDomains = await prisma.projects.count({
      where: {
        domain,
      },
    });

    return existingDomains === 0;
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
  const isOwnerCount = await prisma.projectMembers.count({
    where: {
      projectId,
      userId,
      role: "OWNER",
    },
  });

  return isOwnerCount > 0;
}

export async function isProjectMember(projectId: string, userId: string) {
  const isMemberCount = await prisma.projectMembers.count({
    where: {
      projectId,
      userId,
    },
  });

  return isMemberCount;
}

export async function isProjectMemberWithEmail(
  projectId: string,
  email: string,
) {
  const isMemberCount = await prisma.projectMembers.count({
    where: {
      projectId,
      user: {
        email,
      },
    },
  });

  return isMemberCount > 0;
}

export const IS_NOT_OWNER_MESSAGE =
  "You must be the owner of the project to perform this action";

export const IS_NOT_MEMBER_MESSAGE =
  "You must be a member of the project to continue";
