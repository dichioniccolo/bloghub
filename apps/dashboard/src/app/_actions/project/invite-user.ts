"use server";

import { revalidatePath } from "next/cache";
import { addWeeks } from "date-fns";
import { z } from "zod";

import { db } from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { authenticatedAction } from "../authenticated-action";
import { isOwnerCheck } from "../schemas";

export const inviteUser = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      email: z.string().email(),
    })
    .superRefine(async ({ projectId, email }, ctx) => {
      await isOwnerCheck(projectId, userId, ctx);

      const userExists = await db.projectMember.exists({
        where: {
          projectId,
          user: {
            email,
          },
        },
      });

      if (userExists) {
        ctx.addIssue({
          code: "custom",
          message: "A user with this email already exists in this project",
          path: ["email"],
        });
        return;
      }

      const inviteExists = await db.projectInvitation.exists({
        where: {
          projectId,
          email,
        },
      });

      if (inviteExists) {
        ctx.addIssue({
          code: "custom",
          message: "An invitation has already been sent to this email",
          path: ["email"],
        });
        return;
      }

      const allInvitationsCount = await db.projectInvitation.count({
        where: {
          projectId,
        },
      });

      const allMembersCount = await db.projectMember.count({
        where: {
          projectId,
        },
      });

      const user = await db.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          stripePriceId: true,
        },
      });

      const plan = stripePriceToSubscriptionPlan(user.stripePriceId);

      if (
        !isSubscriptionPlanPro(plan) &&
        allInvitationsCount + allMembersCount >= 3
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "You must be on a pro plan to invite more than 2 users to your project",
          path: ["email"],
        });
      }
    }),
)(async ({ email, projectId }) => {
  const projectInvitation = await db.projectInvitation.create({
    data: {
      projectId,
      email,
      expiresAt: addWeeks(Date.now(), 1),
    },
    select: {
      email: true,
      project: {
        select: {
          name: true,
        },
      },
    },
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
});
