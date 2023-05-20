import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import { prisma } from "@acme/db";

export const DomainSchema = z
  .string()
  .min(3)
  .refine(async (domain) => {
    const count = await prisma.project.count({
      where: {
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
