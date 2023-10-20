"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  and,
  db,
  eq,
  gte,
  isNull,
  projectInvitations,
  projectMembers,
  projects,
  Role,
  users,
} from "@acme/db";
import { inngest } from "@acme/inngest";
import { AppRoutes } from "@acme/lib/routes";

import { authenticatedAction } from "../authenticated-action";

export const acceptInvite = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
    })
    .superRefine(async ({ projectId }, ctx) => {
      const user = await db
        .select({
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, userId))
        .then((x) => x[0]);

      if (!user) {
        ctx.addIssue({
          code: "custom",
          message: "User not found",
          path: ["userId"],
        });
      } else {
        const invite = await db
          .select({
            email: projectInvitations.email,
          })
          .from(projectInvitations)
          .where(
            and(
              eq(projectInvitations.projectId, projectId),
              eq(projectInvitations.email, user.email),
              gte(projectInvitations.expiresAt, new Date()),
            ),
          )
          .then((x) => x[0]);

        if (!invite) {
          ctx.addIssue({
            code: "custom",
            message: "Invite not found",
            path: ["projectId"],
          });
        }
      }
    }),
)(async ({ projectId }, { userId }) => {
  const user = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId))
    .then((x) => x[0]!);

  await db.transaction(async (tx) => {
    await tx
      .delete(projectInvitations)
      .where(
        and(
          eq(projectInvitations.projectId, projectId),
          eq(projectInvitations.email, user.email),
        ),
      );

    await tx.insert(projectMembers).values({
      projectId,
      userId,
      role: Role.Editor,
    });

    const project = await tx
      .select({ name: projects.name })
      .from(projects)
      .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
      .then((x) => x[0]!);

    await inngest.send({
      id: `notification/invitation.accepted/${projectId}-${user.email}`,
      name: "notification/invitation.accepted",
      data: {
        projectId,
        projectName: project.name,
        userEmail: user.email,
      },
    });
  });

  redirect(AppRoutes.ProjectDashboard(projectId));
});
