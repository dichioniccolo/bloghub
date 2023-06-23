"use client";

import { type ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  toast,
} from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { deletePost } from "~/app/_actions/post/delete-post";
import { useUser } from "~/hooks/use-user";

type Props = {
  projectId: string;
  postId: string;
  trigger(loading: boolean): ReactNode;
};

export function DeletePostDialog({ projectId, postId, trigger }: Props) {
  const user = useUser();

  const { mutate, isRunning } = useZact(deletePost, {
    onSuccess: () => {
      toast.success("Post deleted");
    },
  });

  const onDelete = () =>
    mutate({
      postId,
      projectId,
      userId: user.id,
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger(isRunning)}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will delete this post. This action is irreversible and the
            content of the post will be unrecoverable.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
