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
} from "@acme/db";
import { deleteFiles } from "@acme/files";
import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";

export const mediaDeleteUnused = inngest.createFunction(
  {
    id: "media/delete.unused",
    name: "Delete Unused Media",
  },
  {
    cron: "TZ=Europe/Rome 0 * * * *",
  },
  async () => {
    // TODO: find a better way to handle lots of projects
    const allProjects = await db
      .select({
        id: projects.id,
        url: projects.logo,
      })
      .from(projects)
      .then((x) => x);

    const steps = allProjects.map(async (project) => {
      const postsList = await db
        .select({
          id: posts.id,
          thumbnailUrl: posts.thumbnailUrl,
          content: posts.content,
        })
        .from(posts)
        .where(
          and(eq(posts.projectId, project.id), isNotNull(posts.thumbnailUrl)),
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
        (x) => x.url !== project.url,
      );

      await deleteMedia(logoMediaToDelete);

      const thumbnailMediaList = mediaList.filter(
        (x) => x.forEntity === MediaForEntity.PostThumbnail,
      );

      const thumbnailMediaToDelete = thumbnailMediaList.filter((x) =>
        postsList.every(({ thumbnailUrl }) => thumbnailUrl !== x.url),
      );

      await deleteMedia(thumbnailMediaToDelete);

      const postContentMediaList = mediaList.filter(
        (x) => x.forEntity === MediaForEntity.PostContent,
      );

      const postContentMediaToDelete = postContentMediaList.filter((x) =>
        postsList.every((post) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return !findMediaInJsonContent(post.content).includes(x.url);
        }),
      );

      await deleteMedia(postContentMediaToDelete);
    });

    await Promise.all(steps);
  },
);

async function deleteMedia(list: { id: string; url: string }[]) {
  if (list.length === 0) {
    return;
  }

  const filtererList = list.filter((x) => !x.url.includes(env.DO_CDN_URL));

  await deleteFiles(filtererList.map((x) => x.url));
  await db.delete(media).where(
    inArray(
      media.id,
      list.map((x) => x.id),
    ),
  );
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
