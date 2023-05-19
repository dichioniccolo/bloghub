"use server";

import { revalidatePath } from "next/cache";
import { get, has } from "@vercel/edge-config";
import { z } from "zod";

import { createDomain } from "@acme/common/external/vercel";
import { Role, prisma } from "@acme/db";

import { zact } from "../../zact/server";

export const createProject = zact(
  z.object({
    userId: z.string(),
    name: z.string().min(3),
    domain: z
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
      }, "Domain not available"),
  }),
)(async (input) => {
  const { userId, name, domain } = input;

  await createDomain(domain);

  const project = await prisma.project.create({
    data: {
      name,
      domain,
      users: {
        create: {
          role: Role.OWNER,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  });

  revalidatePath("/");

  return project;
});
