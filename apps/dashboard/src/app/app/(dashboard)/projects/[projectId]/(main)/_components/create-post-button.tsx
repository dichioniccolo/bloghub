"use client";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { createPost } from "~/app/_actions/post/create-post";
import { Icons } from "~/app/_components/icons";
import { useZact } from "~/lib/zact/client";

type Props = {
  projectId: string;
};

export function CreatePostButton({ projectId }: Props) {
  const router = useRouter();

  const { mutate, isRunning } = useZact(createPost, {
    onSuccess: (post) => {
      router.push(`/projects/${projectId}/posts/${post.id}`);
    },
  });

  const onCreate = () =>
    mutate({
      projectId,
    });

  return (
    <Button onClick={onCreate}>
      {isRunning ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      Create
    </Button>
  );
}
