import { headers } from "next/headers";
import { Receiver } from "@upstash/qstash";

import { getLoginUrl } from "@acme/auth";
import { deleteProject } from "@acme/common/actions";
import { verifyProjectDomain } from "@acme/common/external/vercel/actions";
import { AppRoutes } from "@acme/common/routes";
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
} from "@acme/db";
import {
  AutomaticProjectDeletion,
  InvalidDomain,
  sendMail,
} from "@acme/emails";

import { env } from "~/env.mjs";

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Upstash-Signature") ?? "";

  const isValid = await receiver.verify({
    signature,
    body,
  });

  if (!isValid) {
    return new Response(null, {
      status: 401,
    });
  }

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
    .limit(100)
    .execute();

  try {
    for await (const project of projectsToVerify) {
      const verificationResult = await verifyProjectDomain(project.domain);

      if (verificationResult.verified) {
        await db
          .delete(automaticEmails)
          .where(eq(automaticEmails.projectId, project.id))
          .execute();
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
          )
          .execute();

        if (invalidDomainEmails.length > 0) {
          continue;
        }

        await db.transaction(async (tx) => {
          const expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);

          const unsubscribeUrl = await getLoginUrl(
            project.owner.email,
            expiresAt,
            `${env.NEXT_PUBLIC_APP_URL}${AppRoutes.NotificationsSettings}`,
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
          });

          await tx
            .insert(automaticEmails)
            .values({
              type: AutomaticEmail.InvalidDomain,
              projectId: project.id,
              userId: project.owner.id,
            })
            .execute();
        });
      } else if (invalidDays > 7) {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const unsubscribeUrl = await getLoginUrl(
          project.owner.email,
          expiresAt,
          `${env.NEXT_PUBLIC_APP_URL}${AppRoutes.NotificationsSettings}`,
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
        });

        await deleteProject(project);
      }
    }

    return new Response(null, {
      status: 200,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return new Response(e?.message, {
      status: 500,
    });
  }
}
