"use client";

import { Loader2 } from "lucide-react";

import { togglePublishedPost } from "~/app/_actions/post/toggle-published-post";
import type { GetPost } from "~/app/_api/posts";
import { Button } from "~/components/ui/button";
import { useZact } from "~/lib/zact/client";

interface Props {
  post: NonNullable<GetPost>;
}

export function UnpublishButton({ post }: Props) {
  const { mutate, isRunning } = useZact(togglePublishedPost);

  const unpublishPost = () =>
    mutate({
      postId: post.id,
      projectId: post.projectId,
    });

  return (
    <Button variant="destructive" onClick={unpublishPost} disabled={isRunning}>
      {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Unpublish
    </Button>
  );
}
