"use server";

import {
  and,
  db,
  eq,
  inArray,
  notifications,
  NotificationStatus,
} from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const archiveAllNotifications = authenticatedAction()(async (
  _,
  { userId },
) => {
  await db
    .update(notifications)
    .set({
      status: NotificationStatus.Archvied,
    })
    .where(
      and(
        eq(notifications.userId, userId),
        inArray(notifications.status, [
          NotificationStatus.Unread,
          NotificationStatus.Read,
        ]),
      ),
    );
});
