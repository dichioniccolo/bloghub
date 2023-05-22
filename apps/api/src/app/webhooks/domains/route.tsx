import { Receiver } from "@upstash/qstash";

import { deleteProject } from "@acme/common/actions";
import { verifyProjectDomain } from "@acme/common/external/vercel/actions";
import { EmailType, Role, prisma } from "@acme/db";
import {
  AutomaticProjectDeletion,
  InvalidDomain,
  sendMarketingMail,
} from "@acme/emails";

import { env } from "~/env.mjs";

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get("Upstash-Signature") as string;

  const isValid = await receiver.verify({
    signature,
    body,
  });

  if (!isValid) {
    return new Response(null, {
      status: 401,
    });
  }

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

  try {
    for await (const project of projects) {
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

        await prisma.$transaction(async (tx) => {
          await sendMarketingMail({
            to: projectOwnerEmail,
            subject: `Your domain ${project.domain} is not configured`,
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

          await tx.emails.create({
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
        });
      } else if (invalidDays > 7) {
        await sendMarketingMail({
          to: projectOwnerEmail,
          subject: `Your ${project.domain} domain is not configured`,
          component: (
            <AutomaticProjectDeletion
              siteName={env.NEXT_PUBLIC_APP_NAME}
              projectName={project.name}
              domain={project.domain}
              invalidDays={invalidDays}
              ownerEmail={projectOwnerEmail}
            />
          ),
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
