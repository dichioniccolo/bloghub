import { db, eq, schema } from "@acme/db";
import { deleteFiles } from "@acme/files";
import { inngest } from "@acme/inngest";
import { deleteDomain } from "@acme/vercel";

export const projectDelete = inngest.createFunction(
  {
    id: "project/delete",
    name: "Delete Project",
  },
  {
    event: "project/delete",
  },
  async ({ event }) => {
    const projectId = event.data.id;

    await db.transaction(async (tx) => {
      const media = await tx.query.media.findMany({
        where: eq(schema.media.projectId, projectId),
        columns: {
          url: true,
        },
      });

      await deleteFiles(media.map((m) => m.url));

      await tx
        .delete(schema.media)
        .where(eq(schema.media.projectId, projectId));

      await tx
        .delete(schema.posts)
        .where(eq(schema.posts.projectId, projectId));

      await tx
        .delete(schema.automaticEmails)
        .where(eq(schema.automaticEmails.projectId, projectId));

      await tx
        .delete(schema.projectMembers)
        .where(eq(schema.projectMembers.projectId, projectId));

      await tx
        .delete(schema.projectInvitations)
        .where(eq(schema.projectInvitations.projectId, projectId));

      await tx
        .delete(schema.visits)
        .where(eq(schema.visits.projectId, projectId));

      await tx.delete(schema.projects).where(eq(schema.projects.id, projectId));

      await deleteDomain(event.data.domain);
    });
  },
);
