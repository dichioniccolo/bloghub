import { getPosts } from "~/app/_api/posts";
import type { GetProject } from "~/app/_api/projects";
import { getProjectOwner } from "~/app/_api/projects";
import { CreatePostButton } from "./create-post-button";
import { PostCard } from "./post-card";

interface Props {
  project: NonNullable<GetProject>;
}

export async function PostsCards({ project }: Props) {
  const [posts, owner] = await Promise.all([
    getPosts(project.id),
    getProjectOwner(project.id),
  ]);

  return (
    <ul className="grid grid-cols-1 gap-4">
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
  );
}
