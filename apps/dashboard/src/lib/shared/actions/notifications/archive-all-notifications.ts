"use server";

import { z } from "zod";

import { and, db, eq, notifications, or } from "@acme/db";

import { zact } from "~/lib/zact/server";

export const archiveAllNotifications = zact(
  z.object({
    userId: z.string().nonempty(),
  }),
)(async ({ userId }) => {
  await db
    .update(notifications)
    .set({
      status: "archived",
    })
    .where(
      and(
        eq(notifications.userId, userId),
        or(
          eq(notifications.status, "unread"),
          eq(notifications.status, "read"),
        ),
      ),
    );
});
