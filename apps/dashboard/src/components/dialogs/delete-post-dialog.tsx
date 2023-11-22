"use client";

import { toast } from "sonner";

import { useServerAction } from "@acme/server-actions/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@acme/ui/components/alert-dialog";

import { deletePost } from "~/app/_actions/post/delete-post";

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
  projectId: string;
  postId: string;
}

export function DeletePostDialog({
  open,
  onOpenChange,
  projectId,
  postId,
}: Props) {
  const { action } = useServerAction(deletePost, {
    onSuccess() {
      toast.success("Post deleted!");
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onDelete = () =>
    action({
      postId,
      projectId,
    });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
