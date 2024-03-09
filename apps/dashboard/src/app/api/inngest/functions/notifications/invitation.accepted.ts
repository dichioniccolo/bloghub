import { createId, db, eq, schema } from "@acme/db";
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
    const project = await step.run("Get project", () =>
      db.query.projects.findFirst({
        where: eq(schema.projects.id, event.data.projectId),
        columns: {
          id: true,
        },
        with: {
          members: {
            limit: 1,
            where: eq(schema.projectMembers.role, "OWNER"),
            columns: {
              userId: true,
            },
            with: {
              user: {
                columns: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    );

    if (!project) {
      return;
    }

    const owner = project.members[0]!;
    const email = step.run("Send Email", async () => {
      await sendMail({
        type: "SOCIAL",
        to: owner.user.email,
        subject: "A user has accepted the project invitation",
        react: ProjectInviteAccepted({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          ownerEmail: owner.user.email,
          ownerName: owner.user.name,
          userEmail: event.data.userEmail,
        }),
        headers: {
          "X-Entity-Ref-ID": createId(),
        },
      });
    });

    const createNotification = step.run("Create notification", async () => {
      return await db.transaction(async (tx) => {
        const [notification] = await tx
          .insert(schema.notifications)
          .values({
            id: createId(),
            type: "INVITATION_ACCEPTED",
            body: event.data,
            userId: owner.userId,
          })
          .returning();

        return notification;
      });
    });
    const [, notification] = await Promise.all([email, createNotification]);

    if (!notification) {
      return;
    }

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
