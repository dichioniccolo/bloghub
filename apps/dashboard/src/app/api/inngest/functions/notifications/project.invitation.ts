import { createId } from "@paralleldrive/cuid2";

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
import { inngest } from "~/lib/inngest";
import { pusherServer } from "~/lib/pusher-server";

export const projectInvitationNotification = inngest.createFunction(
  {
    name: "Project Invitation Notification",
  },
  {
    event: "notification/project.invitation",
  },
  async ({ event }) => {
    const invitation = await db
      .select({
        expiresAt: projectInvitations.expiresAt,
      })
      .from(projectInvitations)
      .where(
        and(
          eq(projectInvitations.projectId, event.data.projectId),
          eq(projectInvitations.email, event.data.userEmail),
        ),
      )
      .then((x) => x[0]);

    if (!invitation) {
      return;
    }

    const url = await getLoginUrl(
      event.data.userEmail,
      invitation.expiresAt,
      `${
        env.NODE_ENV === "development"
          ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
          : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
      }${AppRoutes.ProjectAcceptInvitation(event.data.projectId)}`,
    );

    await sendMail({
      type: EmailNotificationSetting.Social,
      to: event.data.userEmail,
      subject: "You have been invited to a project",
      component: ProjectInvite({
        siteName: env.NEXT_PUBLIC_APP_NAME,
        url,
        userEmail: event.data.userEmail,
      }),
      headers: {
        "X-Entity-Ref-ID": createId(),
      },
    });

    // here the user might not exist, so we need to check for that
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, event.data.userEmail))
      .then((x) => x[0]);

    if (user) {
      const id = createId();

      await db.insert(notifications).values({
        id,
        type: Notification.ProjectInvitation,
        body: event.data,
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
        .where(eq(notifications.id, id))
        .then((x) => x[0]!);

      await pusherServer.trigger(`user__${user.id}`, "notifications", {
        id: notification.id,
        type: notification.type,
        data: event.data,
        createdAt: notification.createdAt,
        status: notification.status,
      });
    }
  },
);
