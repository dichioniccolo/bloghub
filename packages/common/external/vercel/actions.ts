"use server";

import { prisma } from "@acme/db";

import { getConfigResponse, getDomainResponse, verifyDomain } from "../vercel";

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

  const project = await prisma.project.update({
    where: {
      domain,
    },
    data: {
      domainLastCheckedAt: new Date(),
    },
    select: {
      domainUnverifiedAt: true,
    },
  });

  const domainResponse = domainResponsePromise.value;
  const configResponse = configResponsePromise.value;

  if (!domainResponse?.verified) {
    try {
      const verificationResponse = await verifyDomain(domain);

      if (verificationResponse?.verified) {
        await prisma.project.update({
          where: {
            domain,
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
    await prisma.project.update({
      where: {
        domain,
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
    await prisma.project.update({
      where: {
        domain,
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
}
