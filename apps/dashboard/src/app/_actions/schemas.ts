import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import { and, count, db, eq, exists, schema, withExists } from "@acme/db";
import { DOMAIN_REGEX } from "@acme/lib/constants";

export const DomainSchema = z
  .string({
    required_error: "Domain is required",
  })
  .regex(DOMAIN_REGEX, { message: "Invalid domain" })
  .refine(async (domain) => {
    const domainExists = await withExists(
      schema.projects,
      eq(schema.projects.domain, domain),
    );

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
  const isOwner = await withExists(
    schema.projectMembers,
    and(
      eq(schema.projectMembers.projectId, projectId),
      eq(schema.projectMembers.userId, userId),
      eq(schema.projectMembers.role, "OWNER"),
    ),
  );

  return isOwner;
}

export async function isProjectMember(projectId: string, userId: string) {
  const isMember = await withExists(
    schema.projectMembers,
    and(
      eq(schema.projectMembers.projectId, projectId),
      eq(schema.projectMembers.userId, userId),
    ),
  );

  return isMember;
}

export async function isProjectMemberWithEmail(
  projectId: string,
  email: string,
) {
  const isMember = await withExists(
    schema.projectMembers,
    and(
      eq(schema.projectMembers.projectId, projectId),
      exists(
        db
          .select({
            count: count(),
          })
          .from(schema.users)
          .where(
            and(
              eq(schema.projectMembers.userId, schema.users.id),
              eq(schema.users.email, email),
            ),
          ),
      ),
    ),
  );

  return isMember;
}

export const IS_NOT_OWNER_MESSAGE =
  "You must be the owner of the project to perform this action";

export const IS_NOT_MEMBER_MESSAGE =
  "You must be a member of the project to continue";
