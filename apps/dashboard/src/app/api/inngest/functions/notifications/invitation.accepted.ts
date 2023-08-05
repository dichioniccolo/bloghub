import { createId } from "@paralleldrive/cuid2";

import {
  and,
  db,
  EmailNotificationSetting,
  eq,
  Notification,
  notifications,
  projectMembers,
  projects,
  Role,
  users,
} from "@bloghub/db";
import { ProjectInviteAccepted, sendMail } from "@bloghub/emails";

import { env } from "~/env.mjs";
import { inngest } from "~/lib/inngest";
import { pusherServer } from "~/lib/pusher-server";

export const invitationAcceptedNotification = inngest.createFunction(
  {
    name: "Invitation Accepted Notification",
  },
  {
    event: "notification/invitation.accepted",
  },
  async ({ event }) => {
    const project = await db
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

    if (!project) {
      return;
    }

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
        "X-Entity-Ref-ID": createId(),
      },
    });

    const id = createId();

    await db.insert(notifications).values({
      id,
      type: Notification.InvitationAccepted,
      body: event.data,
      userId: project.owner.id,
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

    await pusherServer.trigger(`user__${project.owner.id}`, "notifications", {
      id: notification.id,
      type: notification.type,
      data: event.data,
      createdAt: notification.createdAt,
      status: notification.status,
    });
  },
);
