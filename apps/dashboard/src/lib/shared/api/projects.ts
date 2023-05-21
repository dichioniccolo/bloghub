"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@acme/auth";
import { determinePlanByPriceId } from "@acme/common/external/stripe/actions";
import { prisma } from "@acme/db";

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

export async function getProjectUsers(projectId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const users = await prisma.projectUser.findMany({
    where: {
      projectId,
      project: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      id: true,
      role: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return users;
}

export type GetProjectUsers = Awaited<ReturnType<typeof getProjectUsers>>;

export async function getProjectInvites(projectId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be authenticated");
  }

  const { user } = session;

  const invites = await prisma.invite.findMany({
    where: {
      projectId,
      project: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return invites;
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

export async function getPendingInvite(email: string, projectId: string) {
  const invite = await prisma.invite.findFirst({
    where: {
      projectId,
      email,
    },
    select: {
      expiresAt: true,
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return invite;
}

export type GetPendingInvite = Awaited<ReturnType<typeof getPendingInvite>>;
