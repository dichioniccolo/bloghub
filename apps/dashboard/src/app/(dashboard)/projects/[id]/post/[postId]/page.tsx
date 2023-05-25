import { notFound } from "next/navigation";

import { getPost } from "~/lib/shared/api/posts";
import { EditPostForm } from "./_components/edit-post-form";

type Props = {
  params: {
    id: string;
    postId: string;
  };
};

export default async function Page({ params: { id, postId } }: Props) {
  const post = await getPost(id, postId);

  if (!post) {
    return notFound();
  }

  return <EditPostForm post={post} />;
}
