import { zact } from "zact/server";
import { z } from "zod";

import { prisma } from "@acme/db";

export const getProjects = zact(z.object({ userId: z.string() }))(
  async (input) => {
    const { userId } = input;

    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
        domainVerified: true,
      },
    });

    return projects;
  },
);

export type GetProjects = Awaited<ReturnType<typeof getProjects>>;
