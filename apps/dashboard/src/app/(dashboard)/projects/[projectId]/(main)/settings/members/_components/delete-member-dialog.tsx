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
} from "@bloghub/ui/components/alert-dialog";
import { useZact } from "@bloghub/zact/client";

import { deleteProjectUser } from "~/app/_actions/project/delete-project-user";
import { Icons } from "~/app/_components/icons";

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
  const { mutate, isRunning } = useZact(deleteProjectUser, {
    onSuccess: () => {
      setOpen(false);
    },
  });

  const onDelete = () =>
    mutate({
      projectId,
      userIdToDelete: userToDelete.id,
    });

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
