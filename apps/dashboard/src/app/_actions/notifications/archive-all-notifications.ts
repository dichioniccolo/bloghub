"use server";

import { db, NotificationStatus } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const archiveAllNotifications = authenticatedAction()(async (
  _,
  { userId },
) => {
  await db.notification.updateMany({
    where: {
      userId,
      status: {
        in: [NotificationStatus.READ, NotificationStatus.UNREAD],
      },
    },
    data: {
      status: NotificationStatus.UNREAD,
    },
  });

  // TODO: revalidate notifications query
});
