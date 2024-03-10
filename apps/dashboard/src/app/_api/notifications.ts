"use server";

import { prisma } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getNotifications() {
  const user = await getCurrentUser();

  const [notifications, unreadCount] = await Promise.all([
    prisma.notifications.findMany({
      where: {
        userId: user.id,
        status: {
          in: ["UNREAD", "READ"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      select: {
        id: true,
        type: true,
        body: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.notifications.count({
      where: {
        userId: user.id,
        status: "UNREAD",
      },
    }),
  ]);

  return {
    notifications,
    unreadCount,
  };
}

export type Notification<TData> = Omit<
  Awaited<ReturnType<typeof getNotifications>>["notifications"][number],
  "data"
> & {
  data: TData;
};
