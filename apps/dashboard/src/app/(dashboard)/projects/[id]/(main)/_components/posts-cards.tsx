import { getPosts } from "~/lib/shared/api/posts";
import {
  getProjectOwner,
  getProjectUserRole,
  type GetProject,
} from "~/lib/shared/api/projects";
import { PostCard } from "./PostCard";
import { CreatePostButton } from "./create-post-button";

type Props = {
  project: NonNullable<GetProject>;
};

export async function PostsCards({ project }: Props) {
  const [posts, owner, currentUserRole] = await Promise.all([
    getPosts(project.id),
    getProjectOwner(project.id),
    getProjectUserRole(project.id),
  ]);

  return (
    <ul className="grid grid-cols-1 gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          project={project}
          owner={owner}
          currentUserRole={currentUserRole}
        />
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
