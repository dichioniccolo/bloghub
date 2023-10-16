import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import { and, db, eq, isNull, projects, sql } from "@acme/db";

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
