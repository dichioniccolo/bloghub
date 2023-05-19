"use client";

import { useTransition } from "react";

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
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { deletePost } from "~/lib/shared/actions/delete-post";
import { PostCardButton } from "../../(dashboard)/projects/[id]/(main)/_components/PostCard/post-card-button";

type Props = {
  projectId: string;
  id: string;
};

export function DeletePostDialog({ projectId, id }: Props) {
  const user = useUser();

  const [loading, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <PostCardButton>
          {loading ? (
            <Icons.spinner className="animate-spin text-gray-700 transition-colors dark:text-gray-100" />
          ) : (
            <Icons.delete className="text-red-700 transition-colors group-hover:text-blue-800 dark:text-red-100 dark:group-hover:text-blue-300" />
          )}
          <p className="sr-only">Delete</p>
        </PostCardButton>
      </AlertDialogTrigger>
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
          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deletePost({
                  postId: id,
                  projectId,
                  userId: user.id,
                });
              })
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
