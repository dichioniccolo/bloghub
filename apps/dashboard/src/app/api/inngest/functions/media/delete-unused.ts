import type { JSONContent } from "@tiptap/core";

import {
  and,
  db,
  eq,
  inArray,
  isNotNull,
  media,
  MediaForEntity,
  posts,
  projects,
  sql,
} from "@acme/db";
import { deleteFiles } from "@acme/files";
import { inngest } from "@acme/inngest";
import { Crons } from "@acme/lib/constants";

export const mediaDeleteUnused = inngest.createFunction(
  {
    id: "media/delete.unused",
    name: "Delete Unused Media",
  },
  {
    cron: `TZ=Europe/Rome ${Crons.EVERY_DAY}`,
  },
  async ({ step }) => {
    const allProjects = await step.run("Get all projects", () =>
      db
        .select({
          id: projects.id,
          logo: projects.logo,
          mediaCount: sql<number>`COUNT(${media.id})`.mapWith(Number),
        })
        .from(projects)
        .innerJoin(media, eq(media.projectId, projects.id))
        .groupBy(projects.id, projects.logo)
        .having(sql`COUNT(${media.id}) > 0`),
    );

    const steps = allProjects.map(async (project) => {
      return await step.run(
        `Delete unused media for project ${project.id}`,
        async () => {
          const postsList = await db
            .select({
              id: posts.id,
              thumbnailUrl: posts.thumbnailUrl,
              content: posts.content,
            })
            .from(posts)
            .where(
              and(
                eq(posts.projectId, project.id),
                isNotNull(posts.thumbnailUrl),
              ),
            );

          const mediaList = await db
            .select({
              id: media.id,
              url: media.url,
              forEntity: media.forEntity,
            })
            .from(media)
            .where(eq(media.projectId, project.id));

          const logoMediaList = mediaList.filter(
            (x) => x.forEntity === MediaForEntity.ProjectLogo,
          );

          const logoMediaToDelete = logoMediaList.filter(
            (x) => x.url !== project.logo,
          );

          const thumbnailMediaList = mediaList.filter(
            (x) => x.forEntity === MediaForEntity.PostThumbnail,
          );

          const thumbnailMediaToDelete = thumbnailMediaList.filter((x) =>
            postsList.every(({ thumbnailUrl }) => thumbnailUrl !== x.url),
          );

          const postContentMediaList = mediaList.filter(
            (x) => x.forEntity === MediaForEntity.PostContent,
          );

          const postContentMediaToDelete = postContentMediaList.filter((x) =>
            postsList.every((post) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              return !findMediaInJsonContent(post.content).includes(x.url);
            }),
          );

          const allDeletedMedia = await Promise.all([
            deleteMedia(logoMediaToDelete),
            deleteMedia(thumbnailMediaToDelete),
            deleteMedia(postContentMediaToDelete),
          ]);

          return allDeletedMedia.flatMap((x) => x);
        },
      );
    });

    await Promise.all(steps);
  },
);

interface DeletedMedia {
  id: string;
  url: string;
}

async function deleteMedia(list: DeletedMedia[]): Promise<DeletedMedia[]> {
  if (list.length === 0) {
    return [];
  }

  const filtererList = list.filter((x) => !x.url.includes("bloghub.it"));

  await deleteFiles(filtererList.map((x) => x.url));
  await db.delete(media).where(
    inArray(
      media.id,
      list.map((x) => x.id),
    ),
  );

  return list;
}

const findMediaInJsonContent = (content?: JSONContent): string[] => {
  if (!content) {
    return [];
  }

  if (typeof content === "string") {
    return [];
  }

  if (Array.isArray(content)) {
    return content.flatMap(findMediaInJsonContent);
  }

  if (content.attrs?.src) {
    const src = content.attrs.src as string;

    return [src];
  }

  return findMediaInJsonContent(content.content);
};
