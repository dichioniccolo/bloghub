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
import { deleteProjectInvitation } from "~/lib/shared/actions/project/delete-project-invitation";
import { useZact } from "~/lib/zact/client";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  invitationToDelete: {
    email: string;
  };
};

function DeleteInvitationDialog({
  open,
  setOpen,
  projectId,
  invitationToDelete,
}: Props) {
  const user = useUser();

  const { mutate, isRunning } = useZact(deleteProjectInvitation);

  async function onDelete() {
    await mutate({
      userId: user.id,
      projectId,
      email: invitationToDelete.email,
    });

    setOpen(false);
  }

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
