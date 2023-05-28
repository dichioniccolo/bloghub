"use server";

import { prisma } from "@acme/db";

import { $getUser } from "../get-user";

export async function getNotifications() {
  const user = await $getUser();

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      archivedAt: null,
    },
    select: {
      type: true,
      body: true,
    },
    take: 20,
  });

  return notifications;
}
