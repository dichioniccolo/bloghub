"use client";

import { Loader2, Plus } from "lucide-react";

import { Button } from "@acme/ui/components/button";

import { createPost } from "~/app/_actions/post/create-post";
import { useZact } from "~/lib/zact/client";

interface Props {
  projectId: string;
}

export function CreatePostButton({ projectId }: Props) {
  const { mutate, isRunning } = useZact(createPost);

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
