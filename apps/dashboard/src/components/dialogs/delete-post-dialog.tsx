"use client";

import { toast } from "sonner";

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
import { useZact } from "~/lib/zact/client";

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
  const { mutate } = useZact(deletePost);

  const onDelete = () =>
    toast.promise(
      mutate({
        postId,
        projectId,
      }),
      {
        loading: "Deleting post...",
        success: "Post deleted!",
        error: (e) => `Failed to delete post ${e}`,
      },
    );

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
