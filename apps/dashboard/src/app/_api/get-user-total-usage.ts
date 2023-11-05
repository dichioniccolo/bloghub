"use server";

import { db, Role } from "@acme/db";

export async function getUserTotalUsage(userId: string, from: Date, to: Date) {
  return await db.visit.count({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
      project: {
        deletedAt: null,
        members: {
          some: {
            role: Role.OWNER,
            userId,
          },
        },
      },
    },
  });
}
