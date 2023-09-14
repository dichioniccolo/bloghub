import type { JSONContent } from "@tiptap/react";

import { inngest } from "@acme/inngest";

import { env } from "~/env.mjs";

export const postUpdate = inngest.createFunction(
  {
    name: "Update Post content",
  },
  {
    event: "post/update",
  },
  async ({ event, step }) => {
    // const deleteUnusedMedia = step.run("Delete unusted media", async () => {
    //   const post = await db
    //     .select()
    //     .from(posts)
    //     .where(eq(posts.id, event.data.id))
    //     .then((x) => x[0]);
    //   if (!post) {
    //     return;
    //   }
    //   const mediaList = await db
    //     .select({
    //       id: media.id,
    //       url: media.url,
    //     })
    //     .from(media)
    //     .where(
    //       and(
    //         eq(media.postId, event.data.id),
    //         eq(media.forEntity, MediaForEntity.PostContent),
    //       ),
    //     );
    //   if (mediaList.length === 0) {
    //     return;
    //   }
    //   const matches = findMediaInJsonContent(post.content as JSONContent);
    //   const deletedMedias = mediaList.filter((m) => !matches.includes(m.url));
    //   if (deletedMedias.length === 0) {
    //     return;
    //   }
    //   await deleteFiles(deletedMedias.map((m) => m.url));
    //   await db.delete(media).where(
    //     inArray(
    //       media.id,
    //       deletedMedias.map((m) => m.id),
    //     ),
    //   );
    // });
    // await Promise.all([deleteUnusedMedia]);
  },
);

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

    if (src.includes(env.DO_CDN_URL)) {
      return [src];
    }
  }

  return findMediaInJsonContent(content.content);
};
