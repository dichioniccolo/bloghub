"use client";

import { type Role } from "@acme/db";
import { Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { togglePublishedPost } from "~/lib/shared/actions/toggle-published-post";
import { type GetPost } from "~/lib/shared/api/posts";
import { cn } from "~/lib/utils";
import { useZact } from "~/lib/zact/client";

type Props = {
  post: NonNullable<GetPost>;
  currentUserRole: Role;
};

export function EditPostFormToolbar({ post, currentUserRole }: Props) {
  const user = useUser();

  const { mutate, isRunning } = useZact(togglePublishedPost);

  async function onToggleHidden() {
    await mutate({
      postId: post.id,
      projectId: post.projectId,
      userId: user.id,
    });
  }

  return (
    <div className="flex justify-end gap-2">
      {currentUserRole === "OWNER" && (
        <Button disabled={isRunning} onClick={onToggleHidden}>
          {isRunning ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.share
              className={cn("mr-2 h-4 w-4 transition-all", {
                "rotate-0": post.hidden,
                "rotate-180": !post.hidden,
              })}
            />
          )}
          {post.hidden ? "Publish" : "Unpublish"}
        </Button>
      )}
    </div>
  );
}
