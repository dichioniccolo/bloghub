import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { prisma } from "@acme/db";

export async function getProjects() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return [];
  }

  const { user } = session;

  const projects = await prisma.project.findMany({
    where: {
      users: {
        some: {
          userId: user.id,
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
}

export type GetProjects = Awaited<ReturnType<typeof getProjects>>;
