import type { JSONContent } from "@tiptap/core";

import { db, MediaForEntity } from "@acme/db";
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
    const allProjects = await step.run(
      "Get all projects",
      async () =>
        await db.project.findMany({
          select: {
            id: true,
            logo: true,
            media: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        }),
    );

    const steps = allProjects.map(async (project) => {
      return await step.run(
        `Delete unused media for project ${project.id}`,
        async () => {
          const posts = await db.post.findMany({
            where: {
              projectId: project.id,
              thumbnailUrl: {
                not: null,
              },
            },
            select: {
              id: true,
              thumbnailUrl: true,
              content: true,
            },
          });

          const media = await db.media.findMany({
            where: {
              projectId: project.id,
            },
            select: {
              id: true,
              url: true,
              forEntityEnum: true,
            },
          });

          const logoMediaList = media.filter(
            (x) => x.forEntityEnum === MediaForEntity.PROJECT_LOGO,
          );

          const logoMediaToDelete = logoMediaList.filter(
            (x) => x.url !== project.logo,
          );

          const thumbnailMediaList = media.filter(
            (x) => x.forEntityEnum === MediaForEntity.POST_THUMBNAIL,
          );

          const thumbnailMediaToDelete = thumbnailMediaList.filter((x) =>
            posts.every(({ thumbnailUrl }) => thumbnailUrl !== x.url),
          );

          const postContentMediaList = media.filter(
            (x) => x.forEntityEnum === MediaForEntity.POST_CONTENT,
          );

          const postContentMediaToDelete = postContentMediaList.filter((x) =>
            posts.every((post) => {
              return !findMediaInJsonContent(
                post.content as JSONContent,
              ).includes(x.url);
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

  await db.$transaction(async (tx) => {
    await deleteFiles(filtererList.map((x) => x.url));
    await tx.media.deleteMany({
      where: {
        id: {
          in: list.map((x) => x.id),
        },
      },
    });
  });

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
