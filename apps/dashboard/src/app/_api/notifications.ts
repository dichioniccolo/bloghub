"use server";

import {
  and,
  db,
  desc,
  eq,
  inArray,
  notifications,
  NotificationStatus,
  sql,
} from "@bloghub/db";

import { $getUser } from "./get-user";

export async function getNotifications() {
  const user = await $getUser();

  const list = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      data: notifications.body,
      createdAt: notifications.createdAt,
      status: notifications.status,
    })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, user.id),
        inArray(notifications.status, [
          NotificationStatus.Unread,
          NotificationStatus.Read,
        ]),
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
        eq(notifications.status, NotificationStatus.Unread),
      ),
    )
    .then((x) => x[0]!);

  return {
    notifications: list,
    unreadCount: unread.count,
  };
}

export type Notification<TData> = Omit<
  Awaited<ReturnType<typeof getNotifications>>["notifications"][number],
  "data"
> & {
  data: TData;
};
