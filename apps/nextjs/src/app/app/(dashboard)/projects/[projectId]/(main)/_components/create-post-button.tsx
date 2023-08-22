"use client";

import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import { createPost } from "~/app/_actions/post/create-post";
import { Button } from "~/components/ui/button";
import { useZact } from "~/lib/zact/client";

interface Props {
  projectId: string;
}

export function CreatePostButton({ projectId }: Props) {
  const router = useRouter();

  const { mutate, isRunning } = useZact(createPost, {
    onSuccess: (post) => {
      router.push(`/projects/${projectId}/posts/${post.id}`);
      router.refresh();
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
