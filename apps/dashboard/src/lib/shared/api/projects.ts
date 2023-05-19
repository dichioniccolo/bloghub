"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { prisma } from "@acme/db";
import { determinePlanByPriceId } from "@acme/stripe/actions";

export async function getProjects() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const projects = await prisma.project.findMany({
    where: {
      users: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      logo: true,
      domain: true,
      domainVerified: true,
    },
  });

  return projects;
}
export type GetProjects = Awaited<ReturnType<typeof getProjects>>;

export async function getProject(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const project = await prisma.project.findFirst({
    where: {
      id,
      users: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      logo: true,
      domain: true,
      domainVerified: true,
    },
  });

  return project;
}

export type GetProject = Awaited<ReturnType<typeof getProject>>;

export async function getProjectUserRole(projectId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const { role } = await prisma.projectUser.findFirstOrThrow({
    where: {
      projectId,
      userId: user.id,
    },
    select: {
      role: true,
    },
  });

  return role;
}

export async function getProjectsCount() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const projects = await prisma.project.count({
    where: {
      users: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return projects;
}

export async function getProjectOwner(projectId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const owner = await prisma.projectUser.findFirstOrThrow({
    where: {
      projectId,
      role: "OWNER",
      project: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      user: {
        select: {
          usage: true,
          stripePriceId: true,
        },
      },
    },
  });

  const plan = await determinePlanByPriceId(owner.user.stripePriceId);

  return {
    usage: owner.user.usage,
    quota: plan.quota,
    isPro: plan.isPro,
  };
}

export type GetProjectOwner = Awaited<ReturnType<typeof getProjectOwner>>;
