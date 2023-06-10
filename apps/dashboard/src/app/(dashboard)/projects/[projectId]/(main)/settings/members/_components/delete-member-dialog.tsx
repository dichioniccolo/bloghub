"use client";

import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { deleteProjectUser } from "~/lib/shared/actions/project/delete-project-user";
import { useZact } from "~/lib/zact/client";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  userToDelete: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

function DeleteMemberDialog({ open, setOpen, projectId, userToDelete }: Props) {
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {userToDelete.name ?? userToDelete.email} from your
            project. Are you sure you want to continue?
          </AlertDialogDescription>
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

export function useDeleteMemberDialog(
  projectId: string,
  userToDelete: {
    id: string;
    name?: string | null;
    email?: string | null;
  },
) {
  const [open, setOpen] = useState(false);

  const DeleteMemberDialogCallback = useCallback(
    () => (
      <DeleteMemberDialog
        open={open}
        setOpen={setOpen}
        projectId={projectId}
        userToDelete={userToDelete}
      />
    ),
    [open, projectId, userToDelete],
  );

  return {
    setOpen,
    DeleteMemberDialog: DeleteMemberDialogCallback,
  };
}
