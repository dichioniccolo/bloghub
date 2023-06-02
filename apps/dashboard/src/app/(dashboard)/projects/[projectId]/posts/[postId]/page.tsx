import { notFound } from "next/navigation";

import { getPost } from "~/lib/shared/api/posts";
import { getProjectUserRole } from "~/lib/shared/api/projects";
import { EditPostForm } from "./_components/edit-post-form";

type Props = {
  params: {
    projectId: string;
    postId: string;
  };
};

export default async function Page({ params: { projectId, postId } }: Props) {
  const [post, currentUserRole] = await Promise.all([
    getPost(projectId, postId),
    getProjectUserRole(projectId),
  ]);

  if (!post) {
    return notFound();
  }

  return (
    <div className="mt-4 space-y-4">
      <EditPostForm post={post} currentUserRole={currentUserRole} />
    </div>
  );
}
