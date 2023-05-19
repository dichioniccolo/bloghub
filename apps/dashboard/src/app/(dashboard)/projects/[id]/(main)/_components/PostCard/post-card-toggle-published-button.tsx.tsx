"use client";

import { useTransition } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { togglePublishedPost } from "~/lib/shared/actions/toggle-published-post";
import { type GetPosts } from "~/lib/shared/api/posts";
import { type GetProject } from "~/lib/shared/api/projects";
import { cn } from "~/lib/utils";
import { PostCardButton } from "./post-card-button";

type Props = {
  project: NonNullable<GetProject>;
  post: GetPosts[number];
};

export function PostCardTogglePublishedButton({ project, post }: Props) {
  const user = useUser();

  const [loading, startTransition] = useTransition();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <PostCardButton
          disabled={!project.domainVerified}
          className="group"
          onClick={() =>
            startTransition(async () => {
              await togglePublishedPost({
                userId: user.id,
                projectId: project.id,
                postId: post.id,
              });
            })
          }
        >
          <span className="sr-only">
            {post.published ? "Unpublish" : "Publish"}
          </span>
          {loading ? (
            <Icons.spinner className="animate-spin text-gray-700 transition-colors dark:text-gray-100" />
          ) : (
            <Icons.share
              className={cn("text-gray-700 transition-all dark:text-gray-100", {
                "rotate-0 group-hover:text-blue-800 dark:group-hover:text-blue-300":
                  !post.published,
                "rotate-180 group-hover:text-red-800 dark:group-hover:text-red-300":
                  post.published,
              })}
            />
          )}
        </PostCardButton>
      </TooltipTrigger>
      <TooltipContent>
        {post.published ? "Unpublish" : "Publish"}
      </TooltipContent>
    </Tooltip>
  );
}
