"use server";

import { prisma } from "@acme/db";

export async function getUserTotalUsage(userId: string, from: Date, to: Date) {
  const totalUsage = await prisma.visits.count({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
      project: {
        members: {
          some: {
            userId,
            role: "OWNER",
          },
        },
      },
    },
  });

  return totalUsage;
}
