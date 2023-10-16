"use server";

import { and, db, eq, isNull, projects } from "@acme/db";
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

  await db
    .update(projects)
    .set({
      domainLastCheckedAt: new Date(),
    })
    .where(eq(projects.domain, domain));

  const project = await db
    .select({
      domainUnverifiedAt: projects.domainUnverifiedAt,
    })
    .from(projects)
    .where(and(eq(projects.domain, domain), isNull(projects.deletedAt)))
    .then((x) => x[0]);

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

  if (!domainResponse?.verified) {
    try {
      const verificationResponse = await verifyDomain(domain);

      if (verificationResponse?.verified) {
        await db
          .update(projects)
          .set({
            domainVerified: true,
            domainUnverifiedAt: null,
          })
          .where(eq(projects.domain, domain));

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
    await db
      .update(projects)
      .set({
        domainVerified: false,
        domainUnverifiedAt: !project.domainUnverifiedAt
          ? new Date()
          : undefined,
      })
      .where(eq(projects.domain, domain));

    return {
      invalid: true,
      notFound: false,
      verified: false,
      pending: false,
      domainJson: domainResponse,
      configJson: configResponse,
    };
  } else {
    await db
      .update(projects)
      .set({
        domainVerified: true,
        domainUnverifiedAt: null,
      })
      .where(eq(projects.domain, domain));

    return {
      invalid: false,
      notFound: false,
      verified: true,
      pending: false,
      domainJson: domainResponse,
      configJson: configResponse,
    };
  }
}
