import { PlaceholderWithIllustration } from "~/app/_components/placeholder-with-image";
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
        <PlaceholderWithIllustration
          text="You don't have any posts yet!"
          src="/_static/illustrations/call-waiting.svg"
        >
          <CreatePostButton projectId={project.id} />
        </PlaceholderWithIllustration>
      )}
    </ul>
  );
}
