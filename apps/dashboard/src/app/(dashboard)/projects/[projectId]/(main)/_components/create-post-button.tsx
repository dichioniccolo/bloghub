"use client";

import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";

import { createPost } from "~/app/_actions/post/create-post";

interface Props {
  projectId: string;
}

export function CreatePostButton({ projectId }: Props) {
  const { action, status } = useServerAction(createPost, {
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onCreate = () =>
    action({
      projectId,
    });

  return (
    <Button onClick={onCreate}>
      {status === SubmissionStatus.PENDING ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Plus className="mr-2 h-4 w-4" />
      )}
      Create
    </Button>
  );
}
