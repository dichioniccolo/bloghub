import { getPosts } from "~/app/_api/posts";
import type { GetProject, GetProjectOwner } from "~/app/_api/projects";
import { CreatePostButton } from "./create-post-button";
import { PostCard } from "./post-card";
import { PostsPagination } from "./posts-pagination";

interface Props {
  project: NonNullable<GetProject>;
  owner: NonNullable<GetProjectOwner>;
  pagination: {
    page: number;
    pageSize: number;
  };
  filter?: string;
}

export async function PostsCards({
  project,
  owner,
  pagination,
  filter,
}: Props) {
  // unstable_noStore();
  const { count, data } = await getPosts(project.id, pagination, filter);

  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
      <ul className="grid min-h-[66.5vh] auto-rows-min gap-3">
        {data.map((post) => (
          <PostCard key={post.id} post={post} project={project} owner={owner} />
        ))}
        {data.length === 0 && (
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
      {data.length > 0 && (
        <PostsPagination pagination={pagination} itemsCount={count} />
      )}
    </div>
  );
}
