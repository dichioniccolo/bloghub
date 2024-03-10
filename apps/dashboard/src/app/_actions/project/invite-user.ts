"use server";

import { revalidatePath } from "next/cache";
import { addWeeks } from "date-fns";
import { z } from "zod";

import { prisma } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";
import { ErrorForClient } from "@acme/server-actions";
import { createServerAction } from "@acme/server-actions/server";

import { RequiredEmail, RequiredString } from "~/lib/validation/schema";
import { authenticatedMiddlewares } from "../middlewares/user";
import {
  IS_NOT_OWNER_MESSAGE,
  isProjectMemberWithEmail,
  isProjectOwner,
} from "../schemas";

export const inviteUser = createServerAction({
  actionName: "inviteUser",
  middlewares: authenticatedMiddlewares,
  schema: ({ user }) =>
    z
      .object({
        projectId: RequiredString,
        email: RequiredEmail,
      })
      .superRefine(async ({ projectId, email }, ctx) => {
        const isProjectMember = await isProjectMemberWithEmail(
          projectId,
          email,
        );

        if (isProjectMember) {
          ctx.addIssue({
            code: "custom",
            message: "A user with this email already exists in this project",
            path: ["email"],
          });
          return;
        }

        const invitationExistsCount = await prisma.projectInvitations.count({
          where: {
            email,
            projectId,
            expiresAt: {
              gte: new Date(),
            },
          },
        });

        if (invitationExistsCount > 0) {
          ctx.addIssue({
            code: "custom",
            message: "An invitation has already been sent to this email",
            path: ["email"],
          });
          return;
        }

        // const allInvitationsCount = await withCount(
        //   schema.projectInvitations,
        //   eq(schema.projectInvitations.projectId, projectId),
        // );

        // const allMembersCount = await withCount(
        //   schema.projectMembers,
        //   eq(schema.projectMembers.projectId, projectId),
        // );

        // const dbUser = await db.query.users.findFirst({
        //   where: eq(schema.users.id, user.id),
        //   columns: {
        //     stripePriceId: true,
        //   },
        // });

        // if (!dbUser) {
        //   ctx.addIssue({
        //     code: "custom",
        //     message:
        //       "You must be on a pro plan to invite more than 2 users to your project",
        //     path: ["email"],
        //   });
        //   return;
        // }

        // const plan = stripePriceToSubscriptionPlan(dbUser.stripePriceId);

        // if (
        //   !isSubscriptionPlanPro(plan) &&
        //   allInvitationsCount + allMembersCount >= 3
        // ) {
        //   ctx.addIssue({
        //     code: "custom",
        //     message:
        //       "You must be on a pro plan to invite more than 2 users to your project",
        //     path: ["email"],
        //   });
        // }
      }),
  action: async ({ input: { projectId, email }, ctx: { user } }) => {
    if (!(await isProjectOwner(projectId, user.id))) {
      throw new ErrorForClient(IS_NOT_OWNER_MESSAGE);
    }

    const projectInvitation = await prisma.$transaction(async (tx) => {
      await tx.projectInvitations.delete({
        where: {
          email_projectId: {
            projectId,
            email,
          },
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      return await tx.projectInvitations.create({
        data: {
          projectId,
          email,
          expiresAt: addWeeks(Date.now(), 1),
        },
        select: {
          email: true,
          project: {
            select: { name: true },
          },
        },
      });
    });

    await inngest.send({
      id: `notification/project.invitation/${projectId}-${email}`,
      name: "notification/project.invitation",
      data: {
        projectId,
        projectName: projectInvitation.project.name,
        userEmail: projectInvitation.email,
      },
    });

    revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
  },
});
