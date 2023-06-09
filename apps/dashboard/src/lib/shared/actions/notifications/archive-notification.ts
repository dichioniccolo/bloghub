"use server";

import { z } from "zod";

import { and, db, eq, notifications } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const archiveNotification = zact(
  z.object({
    userId: z.string().nonempty(),
    notificationId: z.number().int(),
  }),
)(async ({ userId, notificationId }) => {
  await db
    .update(notifications)
    .set({
      status: "archived",
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
      ),
    );
});
