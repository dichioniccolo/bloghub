import { differenceInDays } from "date-fns";

import { and, asc, db, eq, schema, withExists } from "@acme/db";
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
      db.query.projects.findMany({
        orderBy: asc(schema.projects.domainLastCheckedAt),
        limit: 50,
        columns: {
          id: true,
          name: true,
          domain: true,
          domainUnverifiedAt: true,
          createdAt: true,
        },
        with: {
          members: {
            limit: 1,
            where: eq(schema.projectMembers.role, "OWNER"),
            with: {
              user: {
                columns: {
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
          await db.transaction(async (tx) => {
            await tx
              .delete(schema.automaticEmails)
              .where(eq(schema.automaticEmails.projectId, project.id));

            await tx
              .update(schema.projects)
              .set({
                domainVerified: true,
                domainUnverifiedAt: null,
              })
              .where(eq(schema.projects.id, project.id));
          });

          return "verified";
        }

        const domainUnverifiedAt =
          typeof project.domainUnverifiedAt === "string"
            ? new Date(project.domainUnverifiedAt)
            : new Date();

        const invalidDays = differenceInDays(new Date(), domainUnverifiedAt);

        if (invalidDays > 3 && invalidDays <= 7) {
          const invalidDomainEmailExists = await withExists(
            schema.automaticEmails,
            and(
              eq(schema.automaticEmails.projectId, project.id),
              eq(schema.automaticEmails.type, "INVALID_DOMAIN"),
              eq(schema.automaticEmails.userId, owner.id),
            ),
          );

          if (invalidDomainEmailExists) {
            return "mail_already_sent";
          }

          await db.transaction(async (tx) => {
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

            await tx.insert(schema.automaticEmails).values({
              type: "INVALID_DOMAIN",
              projectId: project.id,
              userId: owner.id,
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
