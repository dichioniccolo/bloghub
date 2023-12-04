"use server";

import { drizzleDb, eq, schema } from "@acme/db";
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

  const result = await drizzleDb.transaction(async (tx) => {
    const project = await tx.query.projects.findFirst({
      where: eq(schema.projects.domain, domain),
      columns: {
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

    await tx
      .update(schema.projects)
      .set({
        domainLastCheckedAt: new Date(),
      })
      .where(eq(schema.projects.id, project.id));

    if (!domainResponse?.verified) {
      try {
        const verificationResponse = await verifyDomain(domain);

        if (verificationResponse?.verified) {
          await tx
            .update(schema.projects)
            .set({
              domainVerified: 1,
              domainUnverifiedAt: null,
            })
            .where(eq(schema.projects.id, project.id));

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
      await tx
        .update(schema.projects)
        .set({
          domainVerified: 0,
          domainUnverifiedAt: !project.domainUnverifiedAt
            ? new Date()
            : undefined,
        })
        .where(eq(schema.projects.id, project.id));

      return {
        invalid: true,
        notFound: false,
        verified: false,
        pending: false,
        domainJson: domainResponse,
        configJson: configResponse,
      };
    } else {
      await tx
        .update(schema.projects)
        .set({
          domainVerified: 1,
          domainUnverifiedAt: null,
        })
        .where(eq(schema.projects.id, project.id));

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
