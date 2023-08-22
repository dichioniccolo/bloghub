import {
  and,
  db,
  EmailNotificationSetting,
  eq,
  genId,
  Notification,
  notifications,
  projectMembers,
  projects,
  Role,
  users,
} from "@acme/db";
import { ProjectInviteAccepted, sendMail } from "@acme/emails";
import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";
import { pusherServer } from "~/lib/pusher-server";

export const invitationAcceptedNotification = inngest.createFunction(
  {
    name: "Invitation Accepted Notification",
  },
  {
    event: "notification/invitation.accepted",
  },
  async ({ event, step }) => {
    const project = await step.run("Get project", async () => {
      return await db
        .select({
          owner: {
            id: projectMembers.userId,
            name: users.name,
            email: users.email,
          },
        })
        .from(projects)
        .innerJoin(
          projectMembers,
          and(
            eq(projectMembers.projectId, projects.id),
            eq(projectMembers.role, Role.Owner),
          ),
        )
        .innerJoin(users, eq(users.id, projectMembers.userId))
        .where(and(eq(projects.id, event.data.projectId)))
        .then((x) => x[0]);
    });

    if (!project) {
      return;
    }

    const email = step.run("Send Email", async () => {
      await sendMail({
        type: EmailNotificationSetting.Social,
        to: event.data.userEmail,
        subject: "A user has accepted the project invitation",
        component: ProjectInviteAccepted({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          ownerEmail: project.owner.email,
          ownerName: project.owner.name,
          userEmail: event.data.userEmail,
        }),
        headers: {
          "X-Entity-Ref-ID": genId(),
        },
      });
    });

    const createNotification = step.run("Create notification", async () => {
      const id = genId();

      await db.insert(notifications).values({
        id,
        type: Notification.InvitationAccepted,
        body: event.data,
        userId: project.owner.id,
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
      await pusherServer.trigger(`user__${project.owner.id}`, "notifications", {
        id: notification.id,
        type: notification.type,
        data: event.data,
        createdAt: notification.createdAt,
        status: notification.status,
      });
    });
  },
);
