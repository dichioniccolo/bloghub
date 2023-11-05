import {
  AutomaticEmailType,
  db,
  EmailNotificationSettingType,
  Role,
} from "@acme/db";
import { AutomaticProjectDeletion, InvalidDomain } from "@acme/emails";
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
    const projectsToVerify = await step.run(
      "Get projects to verify",
      async () => {
        return await db.project.findMany({
          orderBy: {
            domainLastCheckedAt: "asc",
          },
          where: {
            deletedAt: null,
          },
          take: 50,
          select: {
            id: true,
            name: true,
            domain: true,
            domainUnverifiedAt: true,
            createdAt: true,
            members: {
              where: {
                roleEnum: Role.OWNER,
              },
              take: 1,
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
        });
      },
    );

    const steps = projectsToVerify.map(async (project) => {
      return step.run(`Verify ${project.id}`, async () => {
        const owner = project.members[0]!.user;

        const verificationResult = await verifyProjectDomain(project.domain);

        if (verificationResult.verified) {
          await db.$transaction(async (tx) => {
            await tx.automaticEmail.deleteMany({
              where: {
                projectId: project.id,
              },
            });

            await tx.project.update({
              where: {
                id: project.id,
                deletedAt: null,
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

        const invalidDays = Math.floor(
          (new Date().getTime() - domainUnverifiedAt.getTime()) /
            (1000 * 3600 * 24),
        );

        if (invalidDays > 3 && invalidDays <= 7) {
          const invalidDomainEmailCount = await db.automaticEmail.count({
            where: {
              projectId: project.id,
              type: AutomaticEmailType.INVALID_DOMAIN,
              userId: owner.id,
            },
          });

          if (invalidDomainEmailCount > 0) {
            return "mail_already_sent";
          }

          await db.$transaction(async (tx) => {
            await sendMail({
              type: EmailNotificationSettingType.COMMUNICATION,
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

            await tx.automaticEmail.create({
              data: {
                type: AutomaticEmailType.INVALID_DOMAIN,
                projectId: project.id,
                userId: owner.id,
              },
            });
          });
          return "mail_sent";
        } else if (invalidDays > 7) {
          await db.$transaction(async (tx) => {
            await sendMail({
              type: EmailNotificationSettingType.COMMUNICATION,
              to: owner.email,
              subject: `Your ${project.domain} domain is not configured`,
              react: AutomaticProjectDeletion({
                siteName: env.NEXT_PUBLIC_APP_NAME,
                projectName: project.name,
                domain: project.domain,
                invalidDays,
                ownerEmail: owner.email,
              }),
            });

            // The project here is soft deleted
            await tx.project.softDelete(project.id);
          });

          return "project_set_deleted";
        }
      });
    });

    await Promise.all(steps);
  },
);
