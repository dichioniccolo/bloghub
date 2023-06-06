import { getLoginUrl } from "@acme/auth";
import { AppRoutes } from "@acme/common/routes";
import { db, eq, notifications, users } from "@acme/db";
import { RemovedFromProject, sendMail } from "@acme/emails";
import {
  RemovedFromProjectNotificationSchema,
  type RemovedFromProjectNotificationData,
} from "@acme/notifications";

import { env } from "~/env.mjs";

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
  const userExists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, userEmail))
    .execute();

  if (userExists.length > 0) {
    await db.insert(notifications).values({
      notificationId,
      type: "removed_from_project",
      body,
      userId: userExists[0]!.id,
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
