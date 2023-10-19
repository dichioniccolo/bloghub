import {
  and,
  asc,
  AutomaticEmail,
  automaticEmails,
  db,
  EmailNotificationSetting,
  eq,
  isNull,
  projectMembers,
  projects,
  Role,
  users,
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
        return await db
          .select({
            id: projects.id,
            name: projects.name,
            domain: projects.domain,
            domainUnverifiedAt: projects.domainUnverifiedAt,
            createdAt: projects.createdAt,
            owner: {
              id: users.id,
              email: users.email,
            },
          })
          .from(projects)
          .innerJoin(
            projectMembers,
            and(
              eq(projects.id, projectMembers.projectId),
              eq(projectMembers.role, Role.Owner),
            ),
          )
          .innerJoin(users, eq(users.id, projectMembers.userId))
          .where(isNull(projects.deletedAt))
          .orderBy(asc(projects.domainLastCheckedAt))
          .limit(5);
      },
    );

    const steps = projectsToVerify.map(async (project) => {
      return step.run(`Verify ${project.id}`, async () => {
        const verificationResult = await verifyProjectDomain(project.domain);

        if (verificationResult.verified) {
          await db
            .delete(automaticEmails)
            .where(eq(automaticEmails.projectId, project.id));

          await db
            .update(projects)
            .set({
              domainVerified: true,
              domainUnverifiedAt: null,
            })
            .where(eq(projects.id, project.id));
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
          const invalidDomainEmails = await db
            .select()
            .from(automaticEmails)
            .where(
              and(
                eq(automaticEmails.projectId, project.id),
                eq(automaticEmails.type, AutomaticEmail.InvalidDomain),
                eq(automaticEmails.userId, project.owner.id),
              ),
            );

          if (invalidDomainEmails.length > 0) {
            return "mail_already_sent";
          }

          await db.transaction(async (tx) => {
            await sendMail({
              type: EmailNotificationSetting.Communication,
              to: project.owner.email,
              subject: `Your domain ${project.domain} is not configured`,
              react: InvalidDomain({
                siteName: env.NEXT_PUBLIC_APP_NAME,
                projectId: project.id,
                projectName: project.name,
                domain: project.domain,
                invalidDays,
                ownerEmail: project.owner.email,
              }),
            });
            await tx.insert(automaticEmails).values({
              type: AutomaticEmail.InvalidDomain,
              projectId: project.id,
              userId: project.owner.id,
            });
          });
          return "mail_sent";
        } else if (invalidDays > 7) {
          await sendMail({
            type: EmailNotificationSetting.Communication,
            to: project.owner.email,
            subject: `Your ${project.domain} domain is not configured`,
            react: AutomaticProjectDeletion({
              siteName: env.NEXT_PUBLIC_APP_NAME,
              projectName: project.name,
              domain: project.domain,
              invalidDays,
              ownerEmail: project.owner.email,
            }),
          });

          await db
            .update(projects)
            .set({
              deletedAt: new Date(),
            })
            .where(eq(projects.id, project.id));

          return "project_set_deleted";

          // await step.sendEvent("project/delete", {
          //   name: "project/delete",
          //   data: project,
          // });
        }
      });
    });

    await Promise.all(steps);
  },
);
