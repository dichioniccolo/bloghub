import { getLoginUrl } from "@acme/auth";
import {
  EmailNotificationSettingType,
  NotificationType,
  prisma,
} from "@acme/db";
import { ProjectInvite, sendMail } from "@acme/emails";
import {
  ProjectInvitationNotificationSchema,
  type ProjectInvitationNotificationData,
} from "@acme/notifications";

import { env } from "~/env.mjs";

export async function handleProjectInvitationNotification(
  body: ProjectInvitationNotificationData,
): Promise<Response> {
  const { projectId, userEmail } =
    await ProjectInvitationNotificationSchema.parseAsync(body);

  const invite = await prisma.invite.findUniqueOrThrow({
    where: {
      projectId_email: {
        email: userEmail,
        projectId,
      },
    },
  });

  const url = await getLoginUrl(
    userEmail,
    invite.expiresAt,
    `${env.NEXT_PUBLIC_APP_URL}/projects/${projectId}/accept`,
  );

  // here the user might not exist, so we need to check for that
  const userExists = await prisma.user.count({
    where: {
      email: userEmail,
    },
  });

  if (userExists > 0) {
    await prisma.notification.create({
      data: {
        type: NotificationType.PROJECT_INVITATION,
        body,
        user: {
          connect: {
            email: userEmail,
          },
        },
      },
    });
  }

  await sendMail({
    type: EmailNotificationSettingType.SOCIAL,
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
