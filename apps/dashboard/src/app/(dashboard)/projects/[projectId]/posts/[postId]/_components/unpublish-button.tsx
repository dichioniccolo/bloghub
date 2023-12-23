"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
import { useServerAction } from "@acme/server-actions/client";
import { Button } from "@acme/ui/components/ui/button";

import { unpublishPost } from "~/app/_actions/post/unpublish-post";
import type { GetPost } from "~/app/_api/posts";

interface Props {
  post: NonNullable<GetPost>;
}

export function UnpublishButton({ post }: Props) {
  const { action, status } = useServerAction(unpublishPost, {
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onClick = () =>
    action({
      postId: post.id,
      projectId: post.projectId,
    });

  return (
    <Button
      variant="destructive"
      onClick={onClick}
      disabled={status === SubmissionStatus.PENDING}
    >
      {status === SubmissionStatus.PENDING && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      Unpublish
    </Button>
  );
}
