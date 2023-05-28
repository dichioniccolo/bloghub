"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { deleteProjectUser } from "~/lib/shared/actions/delete-project-user";
import { useZact } from "~/lib/zact/client";

type Props = {
  projectId: string;
  userToDelete: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

export function DeleteMemberDialog({ projectId, userToDelete }: Props) {
  const [open, setOpen] = useState(false);
  const user = useUser();

  const { mutate, isRunning } = useZact(deleteProjectUser);

  async function onDelete() {
    await mutate({
      userId: user.id,
      projectId,
      userIdToDelete: userToDelete.id,
    });

    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="xs" variant="destructive">
          <Icons.delete className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove Member {userToDelete.name ?? userToDelete.email}
          </AlertDialogTitle>
          {/* <AlertDialogDescription>
            Warning: This will permanently delete your project, custom domain,
            and all associated posts + their stats.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            {isRunning && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
