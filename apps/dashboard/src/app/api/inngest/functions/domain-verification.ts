import {
  and,
  asc,
  AutomaticEmail,
  automaticEmails,
  db,
  EmailNotificationSetting,
  eq,
  projectMembers,
  projects,
  Role,
  users,
} from "@bloghub/db";
import {
  AutomaticProjectDeletion,
  InvalidDomain,
  sendMail,
} from "@bloghub/emails";

import { env } from "~/env.mjs";
import { getLoginUrl } from "~/lib/auth";
import { verifyProjectDomain } from "~/lib/common/external/vercel/actions";
import { AppRoutes } from "~/lib/common/routes";
import { inngest } from "~/lib/inngest";

export const cleanupFunction = inngest.createFunction(
  {
    name: "Domain Verification",
  },
  {
    cron: "TZ=Europe/Rome 0 */1 * * *",
  },
  async ({ logger, step }) => {
    const projectsToVerify = await db
      .select({
        id: projects.id,
        name: projects.name,
        domain: projects.domain,
        domainVerified: projects.domainVerified,
        domainUnverifiedAt: projects.domainUnverifiedAt,
        createdAt: projects.createdAt,
        owner: {
          id: users.id,
          email: users.email,
        },
      })
      .from(projects)
      .orderBy(asc(projects.domainLastCheckedAt))
      .innerJoin(
        projectMembers,
        and(
          eq(projects.id, projectMembers.projectId),
          eq(projectMembers.role, Role.Owner),
        ),
      )
      .innerJoin(users, eq(users.id, projectMembers.userId))
      .limit(100);

    for await (const project of projectsToVerify) {
      try {
        const verificationResult = await verifyProjectDomain(project.domain);

        if (verificationResult.verified) {
          await db
            .delete(automaticEmails)
            .where(eq(automaticEmails.projectId, project.id));
          continue;
        }

        const invalidDays = Math.floor(
          Math.floor(
            new Date().getTime() -
              (project.domainUnverifiedAt ?? project.createdAt).getTime(),
          ) /
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
            continue;
          }

          await db.transaction(async (tx) => {
            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);

            const unsubscribeUrl = await getLoginUrl(
              project.owner.email,
              expiresAt,
              `${
                env.NODE_ENV === "development"
                  ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
                  : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
              }${AppRoutes.NotificationsSettings}`,
            );

            await sendMail({
              type: EmailNotificationSetting.Communication,
              to: project.owner.email,
              subject: `Your domain ${project.domain} is not configured`,
              component: InvalidDomain({
                siteName: env.NEXT_PUBLIC_APP_NAME,
                projectId: project.id,
                projectName: project.name,
                domain: project.domain,
                invalidDays,
                ownerEmail: project.owner.email,
                unsubscribeUrl,
              }),
              headers: {
                "List-Unsubscribe": unsubscribeUrl,
              },
            });

            await tx.insert(automaticEmails).values({
              type: AutomaticEmail.InvalidDomain,
              projectId: project.id,
              userId: project.owner.id,
            });
          });
        } else if (invalidDays > 7) {
          const expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);

          const unsubscribeUrl = await getLoginUrl(
            project.owner.email,
            expiresAt,
            `${
              env.NODE_ENV === "development"
                ? `http://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
                : `https://app.${env.NEXT_PUBLIC_APP_DOMAIN}`
            }${AppRoutes.NotificationsSettings}`,
          );

          await sendMail({
            type: EmailNotificationSetting.Communication,
            to: project.owner.email,
            subject: `Your ${project.domain} domain is not configured`,
            component: AutomaticProjectDeletion({
              siteName: env.NEXT_PUBLIC_APP_NAME,
              projectName: project.name,
              domain: project.domain,
              invalidDays,
              ownerEmail: project.owner.email,
              unsubscribeUrl,
            }),
            headers: {
              "List-Unsubscribe": unsubscribeUrl,
            },
          });

          await step.sendEvent({
            name: "project/delete",
            data: project,
          });
        }
      } catch (e) {
        logger.error(
          e,
          "An error occurred while verifying the project domain",
          project.id,
          project.domain,
        );
      }
    }
  },
);
