import {
  and,
  db,
  EmailNotificationSetting,
  eq,
  genId,
  Notification,
  notifications,
  projectInvitations,
  users,
} from "@acme/db";
import { ProjectInvite } from "@acme/emails";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";
import { subdomainUrl } from "@acme/lib/url";
import { pusherServer } from "@acme/pusher/server";

import { env } from "~/env.mjs";
import { getLoginUrl } from "~/lib/auth";
import { sendMail } from "~/lib/email";

export const projectInvitationNotification = inngest.createFunction(
  {
    name: "Project Invitation Notification",
  },
  {
    event: "notification/project.invitation",
  },
  async ({ event, step }) => {
    const invitation = await step.run("Get invitation", () => {
      return db
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
    });

    if (!invitation) {
      return;
    }

    const url = await step.run("Get login url", () => {
      return getLoginUrl(
        event.data.userEmail,
        typeof invitation.expiresAt === "string"
          ? new Date(invitation.expiresAt)
          : invitation.expiresAt,
        `${subdomainUrl("app")}${AppRoutes.ProjectAcceptInvitation(
          event.data.projectId,
        )}`,
      );
    });

    const email = step.run("Send Email", async () => {
      await sendMail({
        type: EmailNotificationSetting.Social,
        to: event.data.userEmail,
        subject: "You have been invited to a project",
        react: ProjectInvite({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          url,
          userEmail: event.data.userEmail,
        }),
        headers: {
          "X-Entity-Ref-ID": genId(),
        },
      });
    });

    // here the user might not exist, so we need to check for that
    const user = await step.run("Get user", async () => {
      return db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, event.data.userEmail))
        .then((x) => x[0]);
    });

    if (!user) {
      return null;
    }

    const createNotification = step.run("Create notification", async () => {
      const id = genId();

      await db.insert(notifications).values({
        id,
        type: Notification.ProjectInvitation,
        body: event.data,
        userId: user.id,
      });

      return await db
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
    });

    const [, notification] = await Promise.all([email, createNotification]);

    await step.run("Send Pusher notification", async () => {
      await pusherServer.trigger(`user__${user.id}`, "notifications", {
        id: notification.id,
        type: notification.type,
        data: event.data,
        createdAt: notification.createdAt,
        status: notification.status,
      });
    });
  },
);
