import { createId, prisma } from "@acme/db";
import { RemovedFromProject } from "@acme/emails";
import { inngest } from "@acme/inngest";
import { pusherServer } from "@acme/pusher/server";

import { env } from "~/env";
import { sendMail } from "~/lib/email";

export const notificationRemovedFromProject = inngest.createFunction(
  {
    id: "notification/project.user.removed",
    name: "Removed from Project Notification",
  },
  {
    event: "notification/project.user.removed",
  },
  async ({ event, step }) => {
    const sendEmail = step.run("Send email", async () => {
      await sendMail({
        type: "SOCIAL",
        to: event.data.userEmail,
        subject: "You have been removed from a project",
        react: RemovedFromProject({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          projectName: event.data.projectName,
          userEmail: event.data.userEmail,
        }),
        headers: {
          "X-Entity-Ref-ID": createId(),
        },
      });
    });

    // here the user might not exist, so we need to check for that
    const user = await step.run("Get user", () =>
      prisma.user.findFirst({
        where: {
          email: event.data.userEmail,
        },
        select: {
          id: true,
        },
      }),
    );

    if (!user) {
      return;
    }

    const createNotification = step.run("Create notification", async () => {
      return await prisma.notifications.create({
        data: {
          type: "REMOVED_FROM_PROJECT",
          body: event.data,
          userId: user.id,
        },
      });
    });

    const [, notification] = await Promise.all([sendEmail, createNotification]);

    if (!notification) {
      return;
    }

    await step.run("Send Pusher notification", async () => {
      await pusherServer.trigger(user.id, "notifications:new", {
        id: notification.id,
        type: notification.type,
        data: event.data,
        createdAt: notification.createdAt,
        status: notification.status,
      });
    });
  },
);
