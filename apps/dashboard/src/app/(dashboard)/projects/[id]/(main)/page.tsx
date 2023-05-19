import { Suspense } from "react";
import { notFound } from "next/navigation";

import { DashboardHeader } from "~/app/_components/dashboard-header";
import { DashboardShell } from "~/app/_components/dashboard-shell";
import { getProject } from "~/lib/shared/api/projects";
import { CreatePostButton } from "./_components/create-post-button";
import { PostsCards } from "./_components/posts-cards";
import { PostsCardsPlaceholder } from "./_components/posts-cards-placeholder";

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params: { id } }: Props) {
  const project = await getProject(id);

  if (!project) {
    return notFound();
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Posts">
        <CreatePostButton projectId={project.id} />
      </DashboardHeader>
      <Suspense fallback={<PostsCardsPlaceholder />}>
        {/* @ts-expect-error react async component */}
        <PostsCards project={project} />
      </Suspense>
    </DashboardShell>
  );
}
