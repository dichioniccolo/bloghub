"use client";

import { type UseFormProps } from "react-hook-form";
import { type z } from "zod";

import { Button, useAutoSaveForm } from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { togglePublishedPost } from "~/lib/shared/actions/post/toggle-published-post";
import { type GetPost } from "~/lib/shared/api/posts";
import { cn } from "~/lib/utils";

type Props<S extends z.ZodTypeAny> = {
  post: NonNullable<GetPost>;
  onSubmit(values: z.input<S>): unknown;
  initialValues?: UseFormProps<z.input<S>>["defaultValues"];
};

export function EditPostFormToolbar<S extends z.ZodTypeAny>({
  post,
  onSubmit,
  initialValues,
}: Props<S>) {
  const user = useUser();

  useAutoSaveForm({
    onSubmit,
    initialValues,
  });

  const { mutate, isRunning } = useZact(togglePublishedPost);

  const onToggleHidden = () =>
    mutate({
      postId: post.id,
      projectId: post.projectId,
      userId: user.id,
    });

  return (
    <div className="flex justify-end gap-2">
      <Button type="button" disabled={isRunning} onClick={onToggleHidden}>
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
        {post.hidden ? "Publish" : "Draft"}
      </Button>
    </div>
  );
}
