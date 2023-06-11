"use server";

import { AppRoutes } from "@acme/common/routes";
import { and, db, eq, projectMembers, projects, sql, users } from "@acme/db";
import { publishNotification } from "@acme/notifications/publish";

import "isomorphic-fetch";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { zact } from "@acme/zact/server";

export const deleteProjectUser = zact(
  z
    .object({
      userId: z.string().nonempty(),
      projectId: z.string().nonempty(),
      userIdToDelete: z.string().nonempty(),
    })
    .superRefine(async ({ userId, projectId, userIdToDelete }, ctx) => {
      const isOwnerCount = await db
        .select({
          count: sql<number>`count(${projectMembers.userId})`.mapWith(Number),
        })
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, userId),
            eq(projectMembers.role, "owner"),
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

      if (userToDelete?.role === "owner") {
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

  await publishNotification("removed_from_project", {
    projectName,
    userEmail,
  });

  revalidatePath(AppRoutes.ProjectSettingsMembers(projectId));
});
