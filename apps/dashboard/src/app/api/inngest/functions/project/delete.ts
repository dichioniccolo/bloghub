import { prisma } from "@acme/db";
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

    await prisma.$transaction(async (tx) => {
      const medium = await tx.media.findMany({
        where: {
          projectId,
        },
        select: {
          url: true,
        },
      });

      await deleteFiles(medium.map((m) => m.url));

      await tx.media.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.posts.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.automaticEmails.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.projectMembers.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.projectInvitations.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.visits.deleteMany({
        where: {
          projectId,
        },
      });

      await tx.projects.delete({
        where: {
          id: projectId,
        },
      });

      await deleteDomain(event.data.domain);
    });
  },
);
