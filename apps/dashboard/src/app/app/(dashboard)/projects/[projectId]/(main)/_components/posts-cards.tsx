"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import type { GetProject, GetProjectOwner } from "~/app/_api/projects";
import { CreatePostButton } from "./create-post-button";
import { PostCard } from "./post-card";
import { PostsCardsPlaceholder } from "./posts-cards-placeholder";
import { PostsPagination } from "./posts-pagination";
import { usePaginatedPosts } from "./use-paginated-posts";

interface Props {
  project: NonNullable<GetProject>;
  owner: NonNullable<GetProjectOwner>;
}

export function PostsCards({ project, owner }: Props) {
  const searchParams = useSearchParams();

  const currentPage: number =
    searchParams.get("page") && typeof searchParams.get("page") === "string"
      ? parseInt(searchParams.get("page")!)
      : 1;

  const pageSize: number =
    searchParams.get("pageSize") &&
    typeof searchParams.get("pageSize") === "string"
      ? parseInt(searchParams.get("pageSize")!)
      : 5;

  const filter =
    searchParams.get("q") && typeof searchParams.get("q") === "string"
      ? searchParams.get("q")!
      : "";

  const pagination = useMemo(
    () => ({
      page: currentPage,
      pageSize,
    }),
    [currentPage, pageSize],
  );

  const {
    data: posts,
    count: postsCount,
    loading,
  } = usePaginatedPosts(project.id, filter, pagination);

  if (loading) {
    return <PostsCardsPlaceholder />;
  }

  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
      <ul className="grid min-h-[66.5vh] auto-rows-min gap-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} project={project} owner={owner} />
        ))}
        {posts.length === 0 && (
          <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">No posts created</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You have not created any posts. Add one below.
              </p>
              <CreatePostButton projectId={project.id} />
            </div>
          </div>
        )}
      </ul>
      {posts.length > 0 && <PostsPagination itemsCount={postsCount} />}
    </div>
  );
}
