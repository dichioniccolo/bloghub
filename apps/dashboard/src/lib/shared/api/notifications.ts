"use server";

import { and, db, desc, eq, inArray, notifications } from "@acme/db";

import { $getUser } from "../get-user";

export async function getNotifications() {
  const user = await $getUser();

  return await db
    .select({
      type: notifications.type,
      body: notifications.body,
    })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, user.id),
        inArray(notifications.status, ["unread", "read"]),
      ),
    )
    .limit(20)
    .orderBy(desc(notifications.createdAt));
}
