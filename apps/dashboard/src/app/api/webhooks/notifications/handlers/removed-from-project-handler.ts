import { createId } from "@paralleldrive/cuid2";

import {
  db,
  EmailNotificationSetting,
  eq,
  Notification,
  notifications,
  users,
} from "@bloghub/db";
import { RemovedFromProject, sendMail } from "@bloghub/emails";

import { env } from "~/env.mjs";
import { getLoginUrl } from "~/lib/auth";
import { AppRoutes } from "~/lib/common/routes";
import type { RemovedFromProjectNotificationData } from "~/lib/notifications";
import { RemovedFromProjectNotificationSchema } from "~/lib/notifications";
import { pusherServer } from "~/lib/pusher-server";

export async function handleRemovedFromProjectNotification(
  notificationId: string,
  body: RemovedFromProjectNotificationData,
): Promise<Response> {
  const { projectName, userEmail } =
    await RemovedFromProjectNotificationSchema.parseAsync(body);

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const unsubscribeUrl = await getLoginUrl(
    userEmail,
    expiresAt,
    `${
      env.NODE_ENV === "development"
        ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
        : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
    }${AppRoutes.NotificationsSettings}`,
  );

  // here the user might not exist, so we need to check for that
  const user = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.email, userEmail))
    .then((x) => x[0]);

  if (user) {
    await db.insert(notifications).values({
      id: notificationId,
      type: Notification.RemovedFromProject,
      body,
      userId: user.id,
    });

    const notification = await db
      .select({
        id: notifications.id,
        type: notifications.type,
        body: notifications.body,
        createdAt: notifications.createdAt,
        status: notifications.status,
      })
      .from(notifications)
      .where(eq(notifications.id, notificationId))
      .then((x) => x[0]!);

    await pusherServer.trigger(`user__${user.id}`, "notifications", {
      id: notification.id,
      type: notification.type,
      data: notification.body,
      createdAt: notification.createdAt,
      status: notification.status,
    });
  }

  await sendMail({
    type: EmailNotificationSetting.Social,
    to: userEmail,
    subject: "You have been removed from a project",
    component: RemovedFromProject({
      siteName: env.NEXT_PUBLIC_APP_NAME,
      projectName,
      unsubscribeUrl,
      userEmail,
    }),
    headers: {
      "X-Entity-Ref-ID": createId(),
      "List-Unsubscribe": unsubscribeUrl,
    },
  });

  return new Response(null, {
    status: 200,
  });
}
