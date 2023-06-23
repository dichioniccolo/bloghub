"use server";

import { z } from "zod";

import {
  and,
  db,
  eq,
  inArray,
  notifications,
  NotificationStatus,
} from "@acme/db";
import { zact } from "@acme/zact/server";

export const archiveAllNotifications = zact(
  z.object({
    userId: z.string().nonempty(),
  }),
)(async ({ userId }) => {
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
