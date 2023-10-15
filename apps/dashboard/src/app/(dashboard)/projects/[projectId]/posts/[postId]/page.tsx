import type { ServerRuntime } from "next";
import { notFound } from "next/navigation";

import { getPost } from "~/app/_api/posts";
import { EditPostForm } from "./_components/edit-post-form";

interface Props {
  params: {
    projectId: string;
    postId: string;
  };
}

export const runtime: ServerRuntime = "edge";

export default async function Page({ params: { projectId, postId } }: Props) {
  const post = await getPost(projectId, postId);

  if (!post) {
    return notFound();
  }

  return <EditPostForm post={post} />;
}
