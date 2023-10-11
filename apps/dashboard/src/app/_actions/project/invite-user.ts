"use server";

import {
  and,
  db,
  eq,
  projectInvitations,
  projectMembers,
  projects,
  Role,
  sql,
  users,
} from "@acme/db";
import { AppRoutes } from "@acme/lib/routes";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { inngest } from "@acme/inngest";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";

export const inviteUser = zactAuthenticated(
  async () => {
    const user = await $getUser();

    return {
      userId: user.id,
    };
  },
  ({ userId }) =>
    z
      .object({
        projectId: z.string().nonempty(),
        email: z.string().email(),
      })
      .superRefine(async ({ projectId, email }, ctx) => {
        const user = await db
          .select({
            email: users.email,
            stripePriceId: users.stripePriceId,
          })
          .from(projectMembers)
          .innerJoin(users, eq(users.id, projectMembers.userId))
          .where(
            and(
              eq(projectMembers.projectId, projectId),
              eq(projectMembers.userId, userId),
              eq(projectMembers.role, Role.Owner),
            ),
          )
          .then((x) => x[0]!);

        if (!user) {
          ctx.addIssue({
            code: "custom",
            message:
              "You must be the owner of the project to perform this action",
            path: ["email"],
          });
          return;
        }

        const existingUser = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(projectMembers)
          .where(eq(projectMembers.projectId, projectId))
          .innerJoin(
            users,
            and(eq(users.id, projectMembers.userId), eq(users.email, email)),
          )
          .then((x) => x[0]!);

        if (existingUser.count > 0) {
          ctx.addIssue({
            code: "custom",
            message: "A user with this email already exists in this project",
            path: ["email"],
          });
          return;
        }

        const existingInvite = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(projectInvitations)
          .where(
            and(
              eq(projectInvitations.projectId, projectId),
              eq(projectInvitations.email, email),
            ),
          )
          .then((x) => x[0]!);

        if (existingInvite.count > 0) {
          ctx.addIssue({
            code: "custom",
            message: "An invitation has already been sent to this email",
            path: ["email"],
          });
          return;
        }

        const { count: projectInvitationsCount } = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(projectInvitations)
          .where(eq(projectInvitations.projectId, projectId))
          .then((x) => x[0]!);

        const { count: projectMembersCount } = await db
          .select({
            count: sql<number>`count(*)`.mapWith(Number),
          })
          .from(projectMembers)
          .where(eq(projectMembers.projectId, projectId))
          .then((x) => x[0]!);

        const plan = stripePriceToSubscriptionPlan(user.stripePriceId);

        if (
          !isSubscriptionPlanPro(plan) &&
          projectInvitationsCount + projectMembersCount >= 3
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
  const ONE_WEEK_IN_SECONDS = 604800;

  await db.transaction(async (tx) => {
    const project = await tx
      .select({
        name: projects.name,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .then((x) => x[0]!);

    await tx.insert(projectInvitations).values({
      email,
      projectId,
      expiresAt: new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000),
    });

    await inngest.send({
      id: `notification/project.invitation/${projectId}-${email}`,
      name: "notification/project.invitation",
      data: {
        projectId,
        projectName: project.name,
        userEmail: email,
      },
    });
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
