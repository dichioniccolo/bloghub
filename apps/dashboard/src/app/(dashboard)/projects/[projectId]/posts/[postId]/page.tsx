import { notFound } from "next/navigation";

import { getPost } from "~/app/_api/posts";
import { EditPostForm } from "./_components/edit-post-form";
import { PublishSheet } from "./_components/publish-sheet";

type Props = {
  params: {
    projectId: string;
    postId: string;
  };
};

export default async function Page({ params: { projectId, postId } }: Props) {
  const post = await getPost(projectId, postId);

  if (!post) {
    return notFound();
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-end">
        <PublishSheet post={post} />
      </div>
      <EditPostForm post={post} />
    </div>
  );
}
