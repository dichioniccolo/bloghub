import { and, db, eq, inArray, media, MediaForEntity, ne } from "@acme/db";
import { deleteFiles } from "@acme/files";
import { inngest } from "@acme/inngest";

export const projectUpdateLogo = inngest.createFunction(
  {
    name: "Update Project logo",
  },
  {
    event: "project/update.logo",
  },
  async ({ event, step }) => {
    const allProjectLogos = await step.run("Get all project logos", () =>
      db
        .select({
          id: media.id,
          url: media.url,
        })
        .from(media)
        .where(
          and(
            eq(media.projectId, event.data.projectId),
            eq(media.forEntity, MediaForEntity.ProjectLogo),
            ne(media.url, event.data.newLogoUrl ?? ""), // keep the new thumbnail
          ),
        ),
    );

    if (allProjectLogos.length === 0) {
      return;
    }

    const urls = allProjectLogos.map((x) => x.url);
    const ids = allProjectLogos.map((x) => x.id);

    await Promise.all([
      step.run("Delete all thumbnail media", () => deleteFiles(urls)),
      step.run("Delete all thumbnail media from DB", () =>
        db.delete(media).where(inArray(media.id, ids)),
      ),
    ]);
  },
);
