import { db } from "@acme/db";
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

    await db.$transaction(async (tx) => {
      const media = await tx.media.findMany({
        where: {
          projectId,
        },
        select: {
          url: true,
        },
      });

      await deleteFiles(media.map((m) => m.url));

      await tx.media.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.post.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.automaticEmail.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.projectMember.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.visit.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.project.delete({
        where: {
          id: projectId,
        },
      });

      await deleteDomain(event.data.domain);
    });
  },
);
