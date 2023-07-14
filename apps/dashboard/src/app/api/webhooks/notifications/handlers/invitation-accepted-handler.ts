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
import type { InvitationAcceptedNotificationData } from "~/lib/notifications";
import { InvitationAcceptedNotificationSchema } from "~/lib/notifications";
import { pusherServer } from "~/lib/pusher-server";

export async function handleInvitationAcceptedHandler(
  notificationId: string,
  body: InvitationAcceptedNotificationData,
): Promise<Response> {
  const { projectId, userEmail } =
    await InvitationAcceptedNotificationSchema.parseAsync(body);

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
    .where(and(eq(projects.id, projectId)))
    .then((x) => x[0]);

  if (!project) {
    return new Response(null, {
      status: 204,
    });
  }

  await db.insert(notifications).values({
    id: notificationId,
    type: Notification.InvitationAccepted,
    body,
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
    .where(eq(notifications.id, notificationId))
    .then((x) => x[0]!);

  await pusherServer.trigger(`user__${project.owner.id}`, "notifications", {
    id: notification.id,
    type: notification.type,
    data: notification.body,
    createdAt: notification.createdAt,
    status: notification.status,
  });

  await sendMail({
    type: EmailNotificationSetting.Social,
    to: userEmail,
    subject: "A user has accepted the project invitation",
    component: ProjectInviteAccepted({
      siteName: env.NEXT_PUBLIC_APP_NAME,
      ownerEmail: project.owner.email,
      ownerName: project.owner.name,
      userEmail,
    }),
    headers: {
      "X-Entity-Ref-ID": createId(),
    },
  });

  return new Response(null, {
    status: 200,
  });
}
