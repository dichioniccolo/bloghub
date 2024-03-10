import { differenceInDays } from "date-fns";

import { prisma } from "@acme/db";
import { InvalidDomain } from "@acme/emails";
import { inngest } from "@acme/inngest";
import { Crons } from "@acme/lib/constants";

import { verifyProjectDomain } from "~/app/_actions/project/verify-project-domain";
import { env } from "~/env.mjs";
import { sendMail } from "~/lib/email";

export const domainVerification = inngest.createFunction(
  {
    id: "domain-verification",
    name: "Domain Verification",
  },
  {
    // cron: "TZ=Europe/Rome 0 */1 * * *", // every hour
    cron: `TZ=Europe/Rome ${Crons.EVERY_12_HOURS}`,
  },
  async ({ step }) => {
    const projectsToVerify = await step.run("Get projects to verify", () =>
      prisma.projects.findMany({
        where: {
          domain: {
            not: {
              contains: "bloghub.it",
            },
          },
        },
        orderBy: {
          domainLastCheckedAt: "asc",
        },
        take: 50,
        select: {
          id: true,
          name: true,
          domain: true,
          domainUnverifiedAt: true,
          createdAt: true,
          members: {
            take: 1,
            where: {
              role: "OWNER",
            },
            select: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    );

    const steps = projectsToVerify.map(async (project) => {
      return step.run(`Verify ${project.id}`, async () => {
        const owner = project.members[0]!.user;

        const verificationResult = await verifyProjectDomain(project.domain);

        if (verificationResult.verified) {
          await prisma.$transaction(async (tx) => {
            await tx.automaticEmails.deleteMany({
              where: {
                projectId: project.id,
              },
            });

            await tx.projects.update({
              where: {
                id: project.id,
              },
              data: {
                domainVerified: true,
                domainUnverifiedAt: null,
              },
            });
          });

          return "verified";
        }

        const domainUnverifiedAt =
          typeof project.domainUnverifiedAt === "string"
            ? new Date(project.domainUnverifiedAt)
            : new Date();

        const invalidDays = differenceInDays(new Date(), domainUnverifiedAt);

        if (invalidDays > 3 && invalidDays <= 7) {
          const invalidDomainEmailExistsCount =
            await prisma.automaticEmails.count({
              where: {
                projectId: project.id,
                type: "INVALID_DOMAIN",
                userId: owner.id,
              },
            });

          if (invalidDomainEmailExistsCount > 0) {
            return "mail_already_sent";
          }

          await prisma.$transaction(async (tx) => {
            await sendMail({
              type: "COMMUNICATION",
              to: owner.email,
              subject: `Your domain ${project.domain} is not configured`,
              react: InvalidDomain({
                siteName: env.NEXT_PUBLIC_APP_NAME,
                projectId: project.id,
                projectName: project.name,
                domain: project.domain,
                invalidDays,
                ownerEmail: owner.email,
              }),
            });

            await tx.automaticEmails.create({
              data: {
                type: "INVALID_DOMAIN",
                projectId: project.id,
                userId: owner.id,
              },
            });
          });
          return "mail_sent";
        } else if (invalidDays > 7) {
          // await sendMail({
          //   type: "COMMUNICATION",
          //   to: owner.email,
          //   subject: `Your ${project.domain} domain is not configured`,
          //   react: AutomaticProjectDeletion({
          //     siteName: env.NEXT_PUBLIC_APP_NAME,
          //     projectName: project.name,
          //     domain: project.domain,
          //     invalidDays,
          //     ownerEmail: owner.email,
          //   }),
          // });
          // await inngest.send({
          //   name: "project/delete",
          //   data: project,
          // });
          // return "project_set_deleted";
        }
      });
    });

    await Promise.all(steps);
  },
);
