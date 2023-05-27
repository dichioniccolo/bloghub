import { notFound } from "next/navigation";

import { getPost } from "~/lib/shared/api/posts";
import { getProjectUserRole } from "~/lib/shared/api/projects";
import { EditPostForm } from "./_components/edit-post-form";
import { EditPostFormToolbar } from "./_components/edit-post-form-toolbar";

type Props = {
  params: {
    id: string;
    postId: string;
  };
};

export default async function Page({ params: { id, postId } }: Props) {
  const [post, currentUserRole] = await Promise.all([
    getPost(id, postId),
    getProjectUserRole(id),
  ]);

  if (!post) {
    return notFound();
  }

  return (
    <div className="mt-4 space-y-4">
      <EditPostFormToolbar post={post} currentUserRole={currentUserRole} />
      <EditPostForm post={post} />
    </div>
  );
}
