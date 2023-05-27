"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getLoginUrl } from "@acme/auth";
import { EmailNotificationSettingType, Role, prisma } from "@acme/db";
import { ProjectInvite, sendMail } from "@acme/emails";

import { env } from "~/env.mjs";
import { zact } from "~/lib/zact/server";

export const inviteUser = zact(
  z
    .object({
      userId: z.string(),
      projectId: z.string(),
      email: z.string().email(),
    })
    .superRefine(async ({ projectId, userId, email }, ctx) => {
      const isOwnerCount = await prisma.projectUser.count({
        where: {
          projectId,
          userId,
          role: Role.OWNER,
        },
      });

      if (isOwnerCount === 0) {
        ctx.addIssue({
          code: "custom",
          message: "You do not have permission to invite users to this project",
          path: ["projectId"],
        });
      }

      const existingUser = await prisma.projectUser.count({
        where: {
          projectId,
          user: {
            email,
          },
        },
      });

      if (existingUser > 0) {
        ctx.addIssue({
          code: "custom",
          message: "A user with this email already exists in this project",
          path: ["email"],
        });
      }

      const existingInvite = await prisma.invite.count({
        where: {
          projectId,
          email,
        },
      });

      if (existingInvite > 0) {
        ctx.addIssue({
          code: "custom",
          message: "An invitation has already been sent to this email",
          path: ["email"],
        });
      }
    }),
)(async ({ email, projectId }) => {
  const ONE_WEEK_IN_SECONDS = 604800;

  await prisma.$transaction(async (tx) => {
    const invite = await tx.invite.create({
      data: {
        email,
        projectId,
        expiresAt: new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000),
      },
      select: {
        expiresAt: true,
      },
    });

    const url = await getLoginUrl(
      email,
      invite.expiresAt,
      `${env.NEXT_PUBLIC_APP_URL}/projects/${projectId}/accept`,
    );

    await sendMail({
      type: EmailNotificationSettingType.SOCIAL,
      to: email,
      subject: "You've been invited to a project",
      component: (
        <ProjectInvite
          siteName={env.NEXT_PUBLIC_APP_NAME}
          url={url}
          userEmail={email}
        />
      ),
      headers: {
        // Set this to prevent Gmail from threading emails.
        // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
        "X-Entity-Ref-ID": `${new Date().getTime()}`,
      },
    });
  });

  revalidatePath(`/projects/${projectId}/settings/members`);
});
