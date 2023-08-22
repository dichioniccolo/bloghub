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
} from "@acme/db";

import { AppRoutes } from "~/lib/common/routes";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { inngest } from "@acme/inngest";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";

export const deleteProjectInvitation = zactAuthenticated(
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
        const isOwnerCount = await db
          .select({
            count: sql<number>`count(${projectMembers.userId})`.mapWith(Number),
          })
          .from(projectMembers)
          .where(
            and(
              eq(projectMembers.projectId, projectId),
              eq(projectMembers.userId, userId),
              eq(projectMembers.role, Role.Owner),
            ),
          )
          .then((x) => x[0]!);

        if (isOwnerCount.count === 0) {
          ctx.addIssue({
            code: "custom",
            message:
              "You must be the owner of the project to perform this action",
            path: ["projectId"],
          });
        }

        const invitationToDelete = await db
          .select()
          .from(projectInvitations)
          .where(
            and(
              eq(projectInvitations.projectId, projectId),
              eq(projectInvitations.email, email),
            ),
          )
          .then((x) => x[0]);

        if (!invitationToDelete) {
          ctx.addIssue({
            code: "custom",
            path: ["userIdToDelete"],
            message: "Invitation not found",
          });
        }
      }),
)(async ({ projectId, email }) => {
  await db
    .delete(projectInvitations)
    .where(
      and(
        eq(projectInvitations.projectId, projectId),
        eq(projectInvitations.email, email),
      ),
    );

  const project = await db
    .select({
      name: projects.name,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .then((x) => x[0]!);

  await inngest.send({
    id: `notification/project.user.removed/${projectId}-${email}`,
    name: "notification/project.user.removed",
    data: {
      projectName: project.name,
      userEmail: email,
    },
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
