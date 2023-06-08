"use server";

import { and, db, desc, eq, inArray, notifications, sql } from "@acme/db";

import { $getUser } from "../get-user";

export async function getNotifications() {
  const user = await $getUser();

  const list = await db
    .select({
      type: notifications.type,
      data: notifications.body,
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

  const unread = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, user.id),
        eq(notifications.status, "unread"),
      ),
    )
    .then((x) => x[0]!);

  return {
    notifications: list,
    unreadCount: unread.count,
  };
}
