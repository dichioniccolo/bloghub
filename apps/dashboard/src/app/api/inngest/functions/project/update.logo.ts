import { and, db, eq, inArray, media, MediaForEntity, ne } from "@bloghub/db";

import { deleteMedias } from "~/lib/common/external/media/actions";
import { inngest } from "~/lib/inngest";

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

    const urls = allProjectLogos.map((x) => x.url);
    const ids = allProjectLogos.map((x) => x.id);

    await Promise.all([
      step.run("Delete all thumbnail media", () => deleteMedias(urls)),
      step.run("Delete all thumbnail media from DB", () =>
        db.delete(media).where(inArray(media.id, ids)),
      ),
    ]);
  },
);