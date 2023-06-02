"use server";

import { NotificationStatus, prisma } from "@acme/db";

import { $getUser } from "../get-user";

export async function getNotifications() {
  const user = await $getUser();

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      status: {
        in: [NotificationStatus.UNREAD, NotificationStatus.READ],
      },
    },
    select: {
      type: true,
      body: true,
    },
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications;
}
