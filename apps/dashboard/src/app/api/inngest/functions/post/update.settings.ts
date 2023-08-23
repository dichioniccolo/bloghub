import { and, db, eq, inArray, media, MediaForEntity, ne } from "@acme/db";
import { deleteFiles } from "@acme/files";
import { inngest } from "@acme/inngest";

export const postUpdateSettings = inngest.createFunction(
  {
    name: "Update Post settings",
  },
  {
    event: "post/update.settings",
  },
  async ({ event, step }) => {
    const allThumbnailMedia = await step.run("Get all thumbnail media", () =>
      db
        .select({
          id: media.id,
          url: media.url,
        })
        .from(media)
        .where(
          and(
            eq(media.projectId, event.data.projectId),
            eq(media.forEntity, MediaForEntity.PostThumbnail),
            ne(media.url, event.data.newThumbnailUrl ?? ""), // keep the new thumbnail
          ),
        ),
    );

    if (allThumbnailMedia.length === 0) {
      return;
    }

    const urls = allThumbnailMedia.map((x) => x.url);
    const ids = allThumbnailMedia.map((x) => x.id);

    await Promise.all([
      step.run("Delete all thumbnail media", () => deleteFiles(urls)),
      step.run("Delete all thumbnail media from DB", () =>
        db.delete(media).where(inArray(media.id, ids)),
      ),
    ]);
  },
);
