import { getLoginUrl } from "@acme/auth";
import { AppRoutes } from "@acme/common/routes";
import {
  and,
  db,
  eq,
  notifications,
  projectInvitations,
  users,
} from "@acme/db";
import { ProjectInvite, sendMail } from "@acme/emails";
import {
  ProjectInvitationNotificationSchema,
  type ProjectInvitationNotificationData,
} from "@acme/notifications";

import { env } from "~/env.mjs";

export async function handleProjectInvitationNotification(
  notificationId: string,
  body: ProjectInvitationNotificationData,
): Promise<Response> {
  const { projectId, userEmail } =
    await ProjectInvitationNotificationSchema.parseAsync(body);

  const invite = await db.query.projectInvitations.findFirst({
    where: and(
      eq(projectInvitations.projectId, projectId),
      eq(projectInvitations.email, userEmail),
    ),
    columns: {
      expiresAt: true,
    },
  });

  if (!invite) {
    return new Response(null, {
      status: 204,
    });
  }

  const url = await getLoginUrl(
    userEmail,
    invite.expiresAt,
    `${env.NEXT_PUBLIC_APP_URL}${AppRoutes.ProjectAcceptInvitation(projectId)}`,
  );

  // here the user might not exist, so we need to check for that
  const userExists = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, userEmail))
    .execute();

  if (userExists.length > 0) {
    await db.insert(notifications).values({
      notificationId,
      type: "project_invitation",
      body,
      userId: userExists[0]!.id,
    });
  }

  await sendMail({
    type: "social",
    to: userEmail,
    subject: "You have been invited to a project",
    component: (
      <ProjectInvite
        siteName={env.NEXT_PUBLIC_APP_NAME}
        url={url}
        userEmail={userEmail}
      />
    ),
  });

  // TODO: uncomment this when we have pusher
  // await pusherServer.trigger(
  //   `user:${userEmail}:project-invitations`,
  //   "project-invitation",
  //   {
  //     projectId,
  //   },
  // );

  return new Response(null, {
    status: 200,
  });
}
