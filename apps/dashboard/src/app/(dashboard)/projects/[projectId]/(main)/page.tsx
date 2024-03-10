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
  searchParams: Record<string, string | string[]>;
}

// export const runtime: ServerRuntime = "edge";

export default async function Page({
  params: { projectId },
  searchParams,
}: Props) {
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const pageSize =
    typeof searchParams.pageSize === "string"
      ? Number(searchParams.pageSize)
      : 5;
  const filter =
    typeof searchParams.q === "string" ? searchParams.q : undefined;

  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  const owner = await getProjectOwner(project.id);

  const pagination = {
    page,
    pageSize,
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Posts">
        <CreatePostButton projectId={project.id} />
      </DashboardHeader>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
        <FilterPosts projectId={project.id} filter={filter} />
        <Suspense fallback={<PostsCardsPlaceholder />}>
          <PostsCards
            project={project}
            owner={owner}
            pagination={pagination}
            filter={filter}
          />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
