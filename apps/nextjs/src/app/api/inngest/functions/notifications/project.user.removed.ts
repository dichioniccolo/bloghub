import {
  db,
  EmailNotificationSetting,
  eq,
  genId,
  Notification,
  notifications,
  users,
} from "@acme/db";
import { RemovedFromProject, sendMail } from "@acme/emails";
import { inngest } from "@acme/inngest";
import { pusherServer } from "@acme/pusher/server";

import { env } from "~/env.mjs";
import { getLoginUrl } from "~/lib/auth";
import { AppRoutes } from "~/lib/common/routes";

export const removedFromProjectNotification = inngest.createFunction(
  {
    name: "Removed from Project Notification",
  },
  {
    event: "notification/project.user.removed",
  },
  async ({ event, step }) => {
    const sendEmail = step.run("Send email", async () => {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      const unsubscribeUrl = await getLoginUrl(
        event.data.userEmail,
        expiresAt,
        `${
          env.NODE_ENV === "development"
            ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
            : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
        }${AppRoutes.NotificationsSettings}`,
      );

      await sendMail({
        type: EmailNotificationSetting.Social,
        to: event.data.userEmail,
        subject: "You have been removed from a project",
        component: RemovedFromProject({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          projectName: event.data.projectName,
          unsubscribeUrl,
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
      return;
    }

    const createNotification = step.run("Create notification", async () => {
      const id = genId();

      await db.insert(notifications).values({
        id,
        type: Notification.RemovedFromProject,
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

    const [, notification] = await Promise.all([sendEmail, createNotification]);

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
