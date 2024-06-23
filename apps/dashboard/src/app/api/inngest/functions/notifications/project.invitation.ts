import { createHash, randomBytes } from "crypto";

import { createId, prisma } from "@acme/db";
import { ProjectInvite } from "@acme/emails";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";
import { subdomainUrl } from "@acme/lib/url";
import { pusherServer } from "@acme/pusher/server";

import { env } from "~/env";
import { sendMail } from "~/lib/email";

export const notificationInvitation = inngest.createFunction(
  {
    id: "notification/project.invitation",
    name: "Project Invitation Notification",
  },
  {
    event: "notification/project.invitation",
  },
  async ({ event, step }) => {
    const invitation = await step.run("Get invitation", () =>
      prisma.projectInvitations.findFirst({
        where: {
          projectId: event.data.projectId,
          email: event.data.userEmail,
        },
      }),
    );

    if (!invitation) {
      return;
    }

    const url = await step.run("Get login url", () => {
      return getLoginUrl(
        event.data.userEmail,
        typeof invitation.expiresAt === "string"
          ? new Date(invitation.expiresAt)
          : invitation.expiresAt,
        `${subdomainUrl("app")}${AppRoutes.ProjectAcceptInvitation(
          event.data.projectId,
        )}`,
      );
    });

    const email = step.run("Send Email", async () => {
      await sendMail({
        type: "SOCIAL",
        to: event.data.userEmail,
        subject: "You have been invited to a project",
        react: ProjectInvite({
          siteName: env.NEXT_PUBLIC_APP_NAME,
          url,
          userEmail: event.data.userEmail,
        }),
        headers: {
          "X-Entity-Ref-ID": createId(),
        },
      });
    });

    // here the user might not exist, so we need to check for that
    const user = await step.run("Get user", () =>
      prisma.user.findUnique({
        where: {
          email: event.data.userEmail,
        },
        select: {
          id: true,
        },
      }),
    );

    if (!user) {
      return null;
    }

    const createNotification = step.run("Create notification", () =>
      prisma.notifications.create({
        data: {
          type: "PROJECT_INVITATION",
          body: event.data,
          userId: user.id,
        },
      }),
    );

    const [, notification] = await Promise.all([email, createNotification]);

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

async function getLoginUrl(
  identifier: string,
  expires: Date,
  callbackUrl: string,
) {
  const token = randomBytes(32).toString("hex");

  await prisma.verificationToken.create({
    data: {
      identifier,
      expires,
      token: createHash("sha256")
        .update(`${token}${env.AUTH_SECRET}`)
        .digest("hex"),
    },
  });

  const params = new URLSearchParams({
    callbackUrl,
    email: identifier,
    token,
  });

  const url = `${subdomainUrl(
    "app",
  )}/api/auth/callback/email?${params.toString()}`;

  return url;
}
