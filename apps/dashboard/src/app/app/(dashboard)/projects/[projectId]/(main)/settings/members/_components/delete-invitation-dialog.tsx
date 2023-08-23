"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";

import { deleteProjectInvitation } from "~/app/_actions/project/delete-project-invitation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useZact } from "~/lib/zact/client";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  invitationToDelete: {
    email: string;
  };
}

function DeleteInvitationDialog({
  open,
  setOpen,
  projectId,
  invitationToDelete,
}: Props) {
  const { mutate, isRunning } = useZact(deleteProjectInvitation, {
    onSuccess: () => {
      setOpen(false);
    },
  });

  const onDelete = () =>
    mutate({
      projectId,
      email: invitationToDelete.email,
    });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {invitationToDelete.email} from your project. Are
            you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useDeleteInvitationDialog(
  projectId: string,
  invitationToDelete: {
    email: string;
  },
) {
  const [open, setOpen] = useState(false);

  const DeleteInvitationDialogCallback = useCallback(
    () => (
      <DeleteInvitationDialog
        open={open}
        setOpen={setOpen}
        projectId={projectId}
        invitationToDelete={invitationToDelete}
      />
    ),
    [open, projectId, invitationToDelete],
  );

  return {
    setOpen,
    DeleteInvitationDialog: DeleteInvitationDialogCallback,
  };
}
