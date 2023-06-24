"use server";

import { z } from "zod";

import { and, db, eq, notifications, NotificationStatus } from "@acme/db";
import { zactAuthenticated } from "@acme/zact/server";

import { $getUser } from "~/app/_api/get-user";

export const archiveNotification = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z
      .object({
        notificationId: z.string().nonempty(),
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
