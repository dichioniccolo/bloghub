"use server";

import { db } from "@acme/db";
import type { ConfigJSON, DomainJSON } from "@acme/vercel";
import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
} from "@acme/vercel";

interface VerifyDomainResponse {
  invalid: boolean;
  notFound: boolean;
  verified: boolean;
  pending: boolean;
  domainJson: DomainJSON | null;
  configJson: ConfigJSON | null;
}

export async function verifyProjectDomain(
  domain: string,
): Promise<VerifyDomainResponse> {
  const [domainResponse, configResponse] = await Promise.all([
    getDomainResponse(domain),
    getConfigResponse(domain),
  ]);

  const result = await db.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: {
        deletedAt: null,
        domain,
      },
      select: {
        id: true,
        domainUnverifiedAt: true,
      },
    });

    if (!project) {
      return {
        invalid: true,
        notFound: false,
        verified: false,
        pending: false,
        domainJson: domainResponse,
        configJson: configResponse,
      };
    }

    await tx.project.update({
      where: {
        id: project.id,
        deletedAt: null,
      },
      data: {
        domainLastCheckedAt: new Date(),
      },
    });

    if (!domainResponse?.verified) {
      try {
        const verificationResponse = await verifyDomain(domain);

        if (verificationResponse?.verified) {
          await db.project.update({
            where: {
              id: project.id,
              deletedAt: null,
            },
            data: {
              domainVerified: true,
              domainUnverifiedAt: null,
            },
          });

          return {
            verified: true,
            invalid: false,
            notFound: false,
            pending: false,
            domainJson: domainResponse,
            configJson: configResponse,
          };
        }
      } catch {
        // ignore
      }

      return {
        verified: false,
        invalid: false,
        notFound: false,
        pending: true,
        domainJson: domainResponse,
        configJson: configResponse,
      };
    }

    if (configResponse?.misconfigured) {
      await db.project.update({
        where: {
          id: project.id,
          deletedAt: null,
        },
        data: {
          domainVerified: false,
          domainUnverifiedAt: !project.domainUnverifiedAt
            ? new Date()
            : undefined,
        },
      });

      return {
        invalid: true,
        notFound: false,
        verified: false,
        pending: false,
        domainJson: domainResponse,
        configJson: configResponse,
      };
    } else {
      await db.project.update({
        where: {
          id: project.id,
          deletedAt: null,
        },
        data: {
          domainVerified: true,
          domainUnverifiedAt: null,
        },
      });

      return {
        invalid: false,
        notFound: false,
        verified: true,
        pending: false,
        domainJson: domainResponse,
        configJson: configResponse,
      };
    }
  });

  return result;
}
