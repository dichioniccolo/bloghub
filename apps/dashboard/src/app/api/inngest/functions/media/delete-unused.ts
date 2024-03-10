import type { JSONContent } from "@tiptap/core";

import { prisma } from "@acme/db";
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
      prisma.projects.findMany({
        select: {
          id: true,
          logo: true,
          medium: {
            select: {
              id: true,
              url: true,
              forEntity: true,
            },
          },
          posts: {
            select: {
              id: true,
              thumbnailUrl: true,
              content: true,
            },
          },
        },
      }),
    );

    const steps = allProjects.map(async (project) => {
      return await step.run(
        `Delete unused media for project ${project.id}`,
        async () => {
          const posts = project.posts;

          const medium = project.medium;

          const logoMediaList = medium.filter(
            (x) => x.forEntity === "PROJECT_LOGO",
          );

          const logoMediaToDelete = logoMediaList.filter(
            (x) => x.url !== project.logo,
          );

          const thumbnailMediaList = medium.filter(
            (x) => x.forEntity === "POST_THUMBNAIL",
          );

          const thumbnailMediaToDelete = thumbnailMediaList.filter((x) =>
            posts.every(({ thumbnailUrl }) => thumbnailUrl !== x.url),
          );

          const postContentMediaList = medium.filter(
            (x) => x.forEntity === "POST_CONTENT",
          );

          const postContentMediaToDelete = postContentMediaList.filter((x) =>
            posts.every(
              (post) =>
                !findMediaInJsonContent(post.content as JSONContent).includes(
                  x.url,
                ),
            ),
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

  await prisma.$transaction(async (tx) => {
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
