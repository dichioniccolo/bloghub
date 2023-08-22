"use server";

import {
  and,
  db,
  eq,
  projectMembers,
  projects,
  Role,
  sql,
  users,
} from "@acme/db";

import { AppRoutes } from "~/lib/common/routes";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { inngest } from "@acme/inngest";

import { $getUser } from "~/app/_api/get-user";
import { zactAuthenticated } from "~/lib/zact/server";

export const deleteProjectUser = zactAuthenticated(
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
        userIdToDelete: z.string().nonempty(),
      })
      .superRefine(async ({ projectId, userIdToDelete }, ctx) => {
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

        const userToDelete = await db
          .select({
            role: projectMembers.role,
          })
          .from(projectMembers)
          .where(
            and(
              eq(projectMembers.userId, userIdToDelete),
              eq(projectMembers.projectId, projectId),
            ),
          )
          .then((x) => x[0]);

        if (!userToDelete) {
          ctx.addIssue({
            code: "custom",
            path: ["userIdToDelete"],
            message: "User not found",
          });
        }

        if (userToDelete?.role === Role.Owner) {
          ctx.addIssue({
            code: "custom",
            path: ["userIdToDelete"],
            message: "You can't delete the owner of the project",
          });
        }
      }),
)(async ({ projectId, userIdToDelete }) => {
  const { userEmail, projectName } = await db
    .select({
      userEmail: users.email,
      projectName: projects.name,
    })
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userIdToDelete),
      ),
    )
    .innerJoin(projects, eq(projects.id, projectMembers.projectId))
    .innerJoin(users, eq(users.id, projectMembers.userId))
    .then((x) => x[0]!);

  await db
    .delete(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userIdToDelete),
      ),
    );

  await inngest.send({
    id: `notification/project.user.removed/${projectId}-${userEmail}`,
    name: "notification/project.user.removed",
    data: {
      projectName,
      userEmail,
    },
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
