"use client";

import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { createPost } from "~/app/_actions/post/create-post";
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
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      Create
    </Button>
  );
}
