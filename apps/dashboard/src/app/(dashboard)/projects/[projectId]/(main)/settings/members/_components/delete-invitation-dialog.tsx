"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SubmissionStatus } from "@acme/server-actions";
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

import { deleteProjectInvitation } from "~/app/_actions/project/delete-project-invitation";

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
  const { action, status } = useServerAction(deleteProjectInvitation, {
    onSuccess: () => {
      setOpen(false);
    },
    onServerError(error) {
      error && toast.error(error);
    },
  });

  const onDelete = () =>
    action({
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
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
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
