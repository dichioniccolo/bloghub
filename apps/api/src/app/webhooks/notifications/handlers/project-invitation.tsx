import { getLoginUrl } from "@acme/auth";
import {
  ProjectInvitationNotificationSchema,
  type ProjectInvitationNotificationData,
} from "@acme/common/notifications";
import {
  EmailNotificationSettingType,
  NotificationType,
  prisma,
} from "@acme/db";
import { ProjectInvite, sendMail } from "@acme/emails";

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

  return new Response(null, {
    status: 200,
  });
}
