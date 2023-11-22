"use client";

import { useState } from "react";
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
  AlertDialogTrigger,
} from "@acme/ui/components/alert-dialog";
import { Button } from "@acme/ui/components/button";

import { quitProject } from "~/app/_actions/project/quit-project";
import type { GetProject } from "~/app/_api/projects";

interface Props {
  project: NonNullable<GetProject>;
}

export function QuitProjectDialog({ project }: Props) {
  const [open, setOpen] = useState(false);

  const { action, status } = useServerAction(quitProject, {
    onSuccess: () => {
      toast.success("You quit the project");
    },
    onServerError: (error) => {
      error && toast.error(error);
    },
  });

  const onDelete = () =>
    action({
      projectId: project.id,
    });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Quit Project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You will quit from this project. If you want to rejoin, the owner of
            the project must invite you again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={status === SubmissionStatus.PENDING}
            onClick={onDelete}
          >
            {status === SubmissionStatus.PENDING && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
