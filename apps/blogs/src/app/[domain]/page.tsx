import { Suspense } from "react";
import type { ServerRuntime } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@acme/db";

import { LastPosts, LastPostsPlaceholder } from "./_components/last-posts";
import { OtherPosts, OtherPostsPlaceholder } from "./_components/other-posts";

interface Props {
  params: {
    domain: string;
  };
  searchParams: {
    page?: string;
  };
}

export const revalidate = 60;

export const runtime: ServerRuntime = "edge";

export default async function Page({ params: { domain } }: Props) {
  // unstable_noStore();

  const project = await prisma.projects.findFirst({
    where: {
      domain,
    },
    select: {
      id: true,
      name: true,
      logo: true,
    },
  });

  if (!project) notFound();

  return (
    <>
      <Suspense fallback={<LastPostsPlaceholder />}>
        <LastPosts projectId={project.id} />
      </Suspense>
      <Suspense fallback={<OtherPostsPlaceholder />}>
        <OtherPosts projectId={project.id} />
      </Suspense>
    </>
  );
}
