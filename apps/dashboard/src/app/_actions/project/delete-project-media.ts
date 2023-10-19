"use server";

import { z } from "zod";

import {
  and,
  db,
  eq,
  isNull,
  media,
  projectMembers,
  projects,
  sql,
} from "@acme/db";
import { deleteFile } from "@acme/files";

import { authenticatedAction } from "../authenticated-action";

export const deleteProjectMedia = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      url: z.string().url(),
    })
    .superRefine(async ({ projectId }, ctx) => {
      const project = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(projects)
        .where(and(eq(projects.id, projectId), isNull(projects.deletedAt)))
        .innerJoin(
          projectMembers,
          and(
            eq(projectMembers.projectId, projects.id),
            eq(projectMembers.userId, userId),
          ),
        )
        .then((x) => x[0]!);

      if (project.count === 0) {
        ctx.addIssue({
          code: "custom",
          message: "You must be a member of the project to perform this action",
          path: ["projectId"],
        });
      }
    }),
)(async ({ projectId, url }) => {
  const dbMedia = await db
    .select()
    .from(media)
    .where(and(eq(media.projectId, projectId), eq(media.url, url)))
    .then((x) => x[0]);

  if (!dbMedia) {
    return;
  }

  await deleteFile(dbMedia.url);
  await db.delete(media).where(eq(media.id, dbMedia.id));
});
