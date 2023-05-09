import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { prisma } from "@acme/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 403 });
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

  return new Response(JSON.stringify(projects));
}
