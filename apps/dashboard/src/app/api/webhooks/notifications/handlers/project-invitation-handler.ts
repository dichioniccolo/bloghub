import {
  and,
  db,
  EmailNotificationSetting,
  eq,
  Notification,
  notifications,
  projectInvitations,
  users,
} from "@bloghub/db";
import { ProjectInvite, sendMail } from "@bloghub/emails";

import { env } from "~/env.mjs";
import { getLoginUrl } from "~/lib/auth";
import { AppRoutes } from "~/lib/common/routes";
import {
  ProjectInvitationNotificationSchema,
  type ProjectInvitationNotificationData,
} from "~/lib/notifications";
import { pusherServer } from "~/lib/pusher-server";

export async function handleProjectInvitationNotification(
  notificationId: string,
  body: ProjectInvitationNotificationData,
): Promise<Response> {
  const { projectId, userEmail } =
    await ProjectInvitationNotificationSchema.parseAsync(body);

  const invite = await db
    .select({
      expiresAt: projectInvitations.expiresAt,
    })
    .from(projectInvitations)
    .where(
      and(
        eq(projectInvitations.projectId, projectId),
        eq(projectInvitations.email, userEmail),
      ),
    )
    .then((x) => x[0]);

  if (!invite) {
    return new Response(null, {
      status: 204,
    });
  }

  const url = await getLoginUrl(
    userEmail,
    invite.expiresAt,
    `${
      env.NODE_ENV === "development"
        ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
        : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
    }${AppRoutes.ProjectAcceptInvitation(projectId)}`,
  );

  // here the user might not exist, so we need to check for that
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, userEmail))
    .then((x) => x[0]);

  if (user) {
    await db.insert(notifications).values({
      id: notificationId,
      type: Notification.ProjectInvitation,
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
    subject: "You have been invited to a project",
    component: ProjectInvite({
      siteName: env.NEXT_PUBLIC_APP_NAME,
      url,
      userEmail,
    }),
  });

  return new Response(null, {
    status: 200,
  });
}
