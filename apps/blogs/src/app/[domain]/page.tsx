import { Suspense } from "react";
import type { ServerRuntime } from "next";
import { unstable_noStore } from "next/cache";
import { notFound } from "next/navigation";

import { db, eq, schema } from "@acme/db";

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

export const runtime: ServerRuntime = "edge";

export default async function Page({ params: { domain } }: Props) {
  unstable_noStore();

  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.domain, domain),
    columns: {
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
