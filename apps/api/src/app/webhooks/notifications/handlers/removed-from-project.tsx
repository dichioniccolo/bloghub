import { getLoginUrl } from "@acme/auth";
import { AppRoutes } from "@acme/common/routes";
import { db, eq, notifications, users } from "@acme/db";
import { RemovedFromProject, sendMail } from "@acme/emails";
import {
  RemovedFromProjectNotificationSchema,
  type RemovedFromProjectNotificationData,
} from "@acme/notifications";

import { env } from "~/env.mjs";
import { pusherServer } from "~/lib/pusher";

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
    `${env.NEXT_PUBLIC_APP_URL}${AppRoutes.NotificationsSettings}`,
  );

  // here the user might not exist, so we need to check for that
  const user = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.email, userEmail))
    .then((x) => x[0]);

  if (user) {
    const notification = await db
      .insert(notifications)
      .values({
        notificationId,
        type: "removed_from_project",
        body,
        userId: user.id,
      })
      .returning({
        id: notifications.id,
        type: notifications.type,
        body: notifications.body,
        createdAt: notifications.createdAt,
        status: notifications.status,
      })
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
    type: "social",
    to: userEmail,
    subject: "You have been removed from a project",
    component: (
      <RemovedFromProject
        siteName={env.NEXT_PUBLIC_APP_NAME}
        projectName={projectName}
        unsubscribeUrl={unsubscribeUrl}
        userEmail={userEmail}
      />
    ),
  });

  return new Response(null, {
    status: 200,
  });
}
