"use server";

import { z } from "zod";

import { verifyProjectDomain } from "@acme/common/external/vercel/actions";
import { Role, prisma } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const verifyDomain = zact(
  z.object({
    userId: z.string(),
    projectId: z.string(),
  }),
)(async ({ userId, projectId }) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      users: {
        some: {
          userId,
          role: Role.OWNER,
        },
      },
    },
    select: {
      domain: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return await verifyProjectDomain(project.domain);
});

export type VerifyDomain = Awaited<ReturnType<typeof verifyDomain>>;
