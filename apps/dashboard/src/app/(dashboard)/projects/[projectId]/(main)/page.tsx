import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getProject, getProjectOwner } from "~/app/_api/projects";
import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { CreatePostButton } from "./_components/create-post-button";
import { FilterPosts } from "./_components/filter-posts";
import { PostsCards } from "./_components/posts-cards";
import { PostsCardsPlaceholder } from "./_components/posts-cards-placeholder";

interface Props {
  params: {
    projectId: string;
  };
}

export default async function Page({ params: { projectId } }: Props) {
  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  const owner = await getProjectOwner(project.id);

  return (
    <DashboardShell>
      <DashboardHeader heading="Posts">
        <CreatePostButton projectId={project.id} />
      </DashboardHeader>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
        <FilterPosts projectId={project.id} />
        <Suspense fallback={<PostsCardsPlaceholder />}>
          <PostsCards project={project} owner={owner} />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
