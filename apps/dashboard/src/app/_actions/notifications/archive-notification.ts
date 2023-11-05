"use server";

import { z } from "zod";

import { db, NotificationStatus } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const archiveNotification = authenticatedAction(() =>
  z.object({
    notificationId: z.string().min(1),
  }),
)(async ({ notificationId }, { userId }) => {
  await db.notification.update({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      status: NotificationStatus.ARCHIVED,
    },
  });
});
