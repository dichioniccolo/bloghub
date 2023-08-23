import {
  automaticEmails,
  db,
  eq,
  media,
  posts,
  projectMembers,
  projects,
  visits,
} from "@acme/db";
import { deleteFiles } from "@acme/files";
import { inngest } from "@acme/inngest";
import { deleteDomain } from "@acme/vercel";

export const projectDelete = inngest.createFunction(
  {
    name: "Delete Project",
  },
  {
    event: "project/delete",
  },
  async ({ event }) => {
    await db.transaction(async (tx) => {
      await deleteDomain(event.data.domain);

      const mediaList = await db
        .select({
          url: media.url,
        })
        .from(media)
        .where(eq(media.projectId, event.data.id));

      await deleteFiles(mediaList.map((m) => m.url));

      await tx.delete(media).where(eq(media.projectId, event.data.id));

      await tx.delete(posts).where(eq(posts.projectId, event.data.id));

      await tx
        .delete(automaticEmails)
        .where(eq(automaticEmails.projectId, event.data.id));

      await tx
        .delete(projectMembers)
        .where(eq(projectMembers.projectId, event.data.id));

      await tx.delete(visits).where(eq(visits.projectId, event.data.id));

      await tx.delete(projects).where(eq(projects.id, event.data.id));
    });
  },
);