"use server";

import { db, eq, projects } from "@acme/db";

import { getConfigResponse, getDomainResponse, verifyDomain } from "./index";

export async function verifyProjectDomain(domain: string) {
  const [domainResponsePromise, configResponsePromise] =
    await Promise.allSettled([
      getDomainResponse(domain),
      getConfigResponse(domain),
    ]);

  if (
    domainResponsePromise?.status === "rejected" ||
    configResponsePromise?.status === "rejected"
  ) {
    return {
      invalid: true,
      notFound: false,
      verified: false,
      pending: false,
      domainJson: null,
      configJson: null,
    };
  }

  const domainResponse = domainResponsePromise.value;
  const configResponse = configResponsePromise.value;

  const project = await db
    .update(projects)
    .set({
      domainLastCheckedAt: new Date(),
    })
    .where(eq(projects.domain, domain))
    .returning({
      domainUnverifiedAt: projects.domainUnverifiedAt,
    })
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
