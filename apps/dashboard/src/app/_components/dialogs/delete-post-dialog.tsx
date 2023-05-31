"use client";

import { useTransition, type ReactNode } from "react";

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
  useToast,
} from "@acme/ui";

import { useUser } from "~/hooks/use-user";
import { deletePost } from "~/lib/shared/actions/delete-post";

type Props = {
  projectId: string;
  postId: string;
  trigger(loading: boolean): ReactNode;
};

export function DeletePostDialog({ projectId, postId, trigger }: Props) {
  const user = useUser();

  const { toast } = useToast();
  const [loading, startTransition] = useTransition();

  const onDelete = () =>
    startTransition(async () => {
      await deletePost({
        postId,
        projectId,
        userId: user.id,
      });

      toast({
        title: "Post deleted",
      });
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger(loading)}</AlertDialogTrigger>
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
