"use server";

import { z } from "zod";

import { and, db, eq, posts, projectMembers, projects, sql } from "@acme/db";

import { authenticatedAction } from "../authenticated-action";

export const updatePost = authenticatedAction(({ userId }) =>
  z
    .object({
      projectId: z.string().min(1),
      postId: z.string().min(1),
      body: z.object({
        title: z.string(),
        description: z.string().optional().nullable(),
        content: z.string().min(1),
      }),
    })
    .superRefine(async ({ postId, projectId }, ctx) => {
      const post = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(posts)
        .where(eq(posts.id, postId))
        .innerJoin(
          projects,
          and(eq(projects.id, posts.projectId), eq(projects.id, projectId)),
        )
        .innerJoin(
          projectMembers,
          and(
            eq(projectMembers.projectId, projects.id),
            eq(projectMembers.userId, userId),
          ),
        )
        .then((x) => x[0]!);

      if (post.count === 0) {
        ctx.addIssue({
          code: "custom",
          message: "You must be a member of the project to perform this action",
          path: ["projectId"],
        });
      }
    }),
)(async ({ postId, body: { title, description, content } }) => {
  // TODO: ideally this would need to be done through a webhook from
  // the provider that stores the ydoc, but for now we'll just fetch it
  // const roomContent = await getRoomContent({
  //   roomId: getRoom(projectId, postId),
  // });

  // const x = new Y.Doc();
  // const arr = new Uint8Array(await roomContent.data!.arrayBuffer());
  // Y.applyUpdate(x, arr);

  // const content = yDocToProsemirrorJSON(x, "default");

  const postContent = Buffer.from(content, "base64").toString("utf-8");

  await db
    .update(posts)
    .set({
      title,
      description,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      content: JSON.parse(postContent),
    })
    .where(eq(posts.id, postId));

  const post = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .then((x) => x[0]!);

  return post;
});
