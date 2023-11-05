"use server";

import { db, NotificationStatus } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getNotifications() {
  const user = await getCurrentUser();

  const notifications = await db.notification.findMany({
    where: {
      userId: user.id,
      status: {
        in: [NotificationStatus.READ, NotificationStatus.UNREAD],
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
  });

  const unreadCount = await db.notification.count({
    where: {
      userId: user.id,
      status: NotificationStatus.UNREAD,
    },
  });

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
