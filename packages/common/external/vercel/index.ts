"use server";

import { env } from "../../env.mjs";

export interface ConfigJSON {
  configuredBy: string;
  nameservers: string[];
  serviceType: string;
  cnames: string[];
  // aValues: string[];
  // conflicts: any[];
  acceptedChallenges: string[];
  misconfigured: boolean;
}

export interface DomainJSON {
  name: string;
  apexName: string;
  updatedAt: number;
  createdAt: number;
  verified: boolean;
  verification: VerificationTypeJSON[];
  error?: {
    code: string;
  };
}

export interface VerificationTypeJSON {
  type: string;
  domain: string;
  value: string;
  reason: string;
}

export interface VerificationJSON {
  verified: boolean;
}

const headers = {
  Authorization: `Bearer ${env.VERCEL_BEARER_TOKEN}`,
};

export async function createDomain(name: string): Promise<DomainJSON> {
  if (!env.VERCEL_ENABLE_DOMAIN) {
    return {
      name,
      apexName: name,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      verified: true,
      verification: [],
    };
  }

  return await fetch(
    `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains?teamId=${env.VERCEL_TEAM_ID}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
      }),
    },
  ).then((r) => r.json() as Promise<DomainJSON>);
}

export async function deleteDomain(name: string): Promise<DomainJSON> {
  if (!env.VERCEL_ENABLE_DOMAIN) {
    return {
      name,
      apexName: name,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      verified: true,
      verification: [],
    };
  }

  return await fetch(
    `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${name}?teamId=${env.VERCEL_TEAM_ID}`,
    {
      method: "DELETE",
      headers,
    },
  ).then((r) => r.json() as Promise<DomainJSON>);
}

export async function getDomainResponse(name: string) {
  if (!env.VERCEL_ENABLE_DOMAIN) {
    return {
      name,
      apexName: name,
      updatedAt: Date.now(),
      createdAt: Date.now(),
      verified: true,
      verification: [],
    };
  }

  return await fetch(
    `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${name}?teamId=${env.VERCEL_TEAM_ID}`,
    {
      method: "GET",
      headers,
    },
  ).then((r) => r.json() as Promise<DomainJSON>);
}

export async function getConfigResponse(name: string): Promise<ConfigJSON> {
  if (!env.VERCEL_ENABLE_DOMAIN) {
    return {
      configuredBy: "user",
      nameservers: [],
      serviceType: "external",
      cnames: [],
      // aValues: [],
      // conflicts: [],
      acceptedChallenges: [],
      misconfigured: false,
    };
  }

  return await fetch(
    `${env.VERCEL_API_URL}/v6/domains/${name}/config?teamId=${env.VERCEL_TEAM_ID}`,
    {
      method: "GET",
      headers,
    },
  ).then((r) => r.json() as Promise<ConfigJSON>);
}

export async function verifyDomain(name: string): Promise<VerificationJSON> {
  if (!env.VERCEL_ENABLE_DOMAIN) {
    return {
      verified: true,
    };
  }

  return await fetch(
    `${env.VERCEL_API_URL}/v9/projects/${env.VERCEL_PROJECT_ID}/domains/${name}/verify?teamId=${env.VERCEL_TEAM_ID}`,
    {
      method: "POST",
      headers,
    },
  ).then((r) => r.json() as Promise<VerificationJSON>);
}
