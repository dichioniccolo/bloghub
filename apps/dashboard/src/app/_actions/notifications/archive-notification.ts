"use server";

import { z } from "zod";

import { and, db, eq, notifications, NotificationStatus } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const archiveNotification = authenticatedAction(({ userId }) =>
  z
    .object({
      notificationId: z.string().min(1),
    })
    .superRefine(async ({ notificationId }, ctx) => {
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
)(async ({ notificationId }, { userId }) => {
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
