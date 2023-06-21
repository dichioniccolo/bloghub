"use server";

import { z } from "zod";

import { and, db, eq, notifications, NotificationStatus } from "@acme/db";
import { zact } from "@acme/zact/server";

export const archiveNotification = zact(
  z
    .object({
      userId: z.string().nonempty(),
      notificationId: z.string().nonempty(),
    })
    .superRefine(async ({ userId, notificationId }, ctx) => {
      const notification = await db
        .select({
          id: notifications.id,
        })
        .from(notifications)
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, userId),
          ),
        )
        .then((x) => x[0]);

      if (!notification) {
        ctx.addIssue({
          code: "custom",
          message: "Notification not found",
          path: ["notificationId"],
        });
      }
    }),
)(async ({ userId, notificationId }) => {
  await db
    .update(notifications)
    .set({
      status: NotificationStatus.Archvied,
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
      ),
    );
});
