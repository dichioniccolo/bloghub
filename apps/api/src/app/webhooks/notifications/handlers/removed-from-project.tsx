import { getLoginUrl } from "@acme/auth";
import { AppRoutes } from "@acme/common/routes";
import {
  EmailNotificationSettingType,
  NotificationType,
  prisma,
} from "@acme/db";
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

  await prisma.$transaction(async (tx) => {
    await tx.notification.create({
      data: {
        notificationId,
        type: NotificationType.REMOVED_FROM_PROJECT,
        body,
        user: {
          connect: {
            email: userEmail,
          },
        },
      },
    });

    await sendMail({
      type: EmailNotificationSettingType.SOCIAL,
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
  });

  return new Response(null, {
    status: 200,
  });
}
