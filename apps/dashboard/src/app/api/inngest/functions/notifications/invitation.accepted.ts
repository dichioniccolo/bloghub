import {
  db,
  EmailNotificationSettingType,
  genId,
  NotificationType,
  Role,
} from "@acme/db";
import { ProjectInviteAccepted } from "@acme/emails";
import { inngest } from "@acme/inngest";
import { pusherServer } from "@acme/pusher/server";

import { env } from "~/env.mjs";
import { sendMail } from "~/lib/email";

export const notificationInvitationAccepted = inngest.createFunction(
  {
    id: "notification/invitation.accepted",
    name: "Invitation Accepted Notification",
  },
  {
    event: "notification/invitation.accepted",
  },
  async ({ event, step }) => {
    const project = await step.run("Get project", async () => {
      return await db.project.findUniqueOrThrow({
        where: {
          id: event.data.projectId,
          deletedAt: null,
        },
        select: {
          members: {
            take: 1,
            where: {
              roleEnum: Role.OWNER,
            },
            select: {
              userId: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    if (!project) {
      return;
    }

    const owner = project.members[0]!;
    const email = step.run("Send Email", async () => {
      await sendMail({
        type: EmailNotificationSettingType.SOCIAL,
        to: owner.user.email,
        subject: "A user has accepted the project invitation",
        react: ProjectInviteAccepted({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          ownerEmail: owner.user.email,
          ownerName: owner.user.name,
          userEmail: event.data.userEmail,
        }),
        headers: {
          "X-Entity-Ref-ID": genId(),
        },
      });
    });

    const createNotification = step.run("Create notification", async () => {
      return await db.notification.create({
        data: {
          type: NotificationType.INVITATION_ACCEPTED,
          body: event.data,
          userId: owner.userId,
        },
        select: {
          id: true,
          type: true,
          body: true,
          createdAt: true,
          status: true,
        },
      });
    });
    const [, notification] = await Promise.all([email, createNotification]);

    await step.run("Send Pusher notification", async () => {
      await pusherServer.trigger(owner.userId, "notifications:new", {
        id: notification.id,
        type: notification.type,
        data: event.data,
        createdAt: notification.createdAt,
        status: notification.status,
      });
    });
  },
);
