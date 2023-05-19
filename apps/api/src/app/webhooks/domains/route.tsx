import { deleteDomain } from "@acme/common/external/vercel";
import { verifyProjectDomain } from "@acme/common/external/vercel/actions";
import { EmailType, Role, prisma } from "@acme/db";
import { InvalidDomain, sendMarketingMail } from "@acme/emails";

import { env } from "~/env.mjs";

export async function POST(_req: Request) {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      domain: true,
      domainVerified: true,
      domainUnverifiedAt: true,
      createdAt: true,
      users: {
        where: {
          role: Role.OWNER,
        },
        take: 1,
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      domainLastCheckedAt: "asc",
    },
    take: 100,
  });

  await Promise.all(
    projects.map(async (project) => {
      const verificationResult = await verifyProjectDomain(project.domain);

      if (verificationResult.verified) {
        return;
      }

      const invalidDays = Math.floor(
        Math.floor(
          new Date().getTime() -
            new Date(project.domainUnverifiedAt ?? project.createdAt).getTime(),
        ) /
          (1000 * 3600 * 24),
      );

      const projectOwnerEmail = project.users[0]?.user.email ?? "";

      if (invalidDays > 3 && invalidDays <= 7) {
        const invalidDomainEmailCount = await prisma.emails.count({
          where: {
            projectId: project.id,
            type: EmailType.INVALID_DOMAIN,
            user: {
              email: projectOwnerEmail,
            },
          },
        });

        if (invalidDomainEmailCount > 0) {
          return;
        }

        await sendMarketingMail({
          to: projectOwnerEmail,
          subject: `Your ${project.domain} domain is not configured`,
          component: (
            <InvalidDomain
              siteName={env.NEXT_PUBLIC_APP_NAME}
              projectId={project.id}
              projectName={project.name}
              domain={project.domain}
              invalidDays={invalidDays}
              ownerEmail={projectOwnerEmail}
            />
          ),
        });

        await prisma.emails.create({
          data: {
            project: {
              connect: {
                id: project.id,
              },
            },
            type: EmailType.INVALID_DOMAIN,
            user: {
              connect: {
                email: projectOwnerEmail,
              },
            },
          },
        });
      } else if (invalidDays > 7) {
        await prisma.$transaction(async (tx) => {
          await deleteDomain(project.domain);

          // TODO: Send email

          await tx.project.delete({
            where: {
              id: project.id,
            },
          });
        });
      }
    }),
  );

  return new Response(null, {
    status: 200,
  });
}
