"use server";

import {
  and,
  db,
  eq,
  inArray,
  notifications,
  NotificationStatus,
} from "@acme/db";
import { zactAuthenticated } from "@acme/zact/server";

import { $getUser } from "~/app/_api/get-user";

export const archiveAllNotifications = zactAuthenticated(async () => {
  const user = await $getUser();

  return {
    userId: user.id,
  };
})(async (_, { userId }) => {
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
