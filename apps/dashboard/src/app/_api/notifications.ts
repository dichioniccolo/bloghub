"use server";

import { and, db, eq, inArray, schema, withCount } from "@acme/db";

import { getCurrentUser } from "./get-user";

export async function getNotifications() {
  const user = await getCurrentUser();

  const [notifications, unreadCount] = await Promise.all([
    db.query.notifications.findMany({
      where: and(
        eq(schema.notifications.userId, user.id),
        inArray(schema.notifications.status, ["READ", "UNREAD"]),
      ),
      limit: 20,
      columns: {
        id: true,
        type: true,
        body: true,
        createdAt: true,
        status: true,
      },
    }),
    withCount(
      schema.notifications,
      and(
        eq(schema.notifications.userId, user.id),
        eq(schema.notifications.status, "UNREAD"),
      ),
    ),
  ]);

  return {
    notifications,
    unreadCount,
  };
}

export type Notification<TData> = Omit<
  Awaited<ReturnType<typeof getNotifications>>["notifications"][number],
  "data"
> & {
  data: TData;
};
