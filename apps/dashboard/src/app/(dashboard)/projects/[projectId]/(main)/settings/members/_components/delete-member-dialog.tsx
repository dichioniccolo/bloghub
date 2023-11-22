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

import { deleteProjectUser } from "~/app/_actions/project/delete-project-user";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  userToDelete: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

function DeleteMemberDialog({ open, setOpen, projectId, userToDelete }: Props) {
  const { action, status } = useServerAction(deleteProjectUser, {
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
      userId: userToDelete.id,
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
