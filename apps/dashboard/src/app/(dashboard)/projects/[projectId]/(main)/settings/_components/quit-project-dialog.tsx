"use client";

import { useState } from "react";
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
} from "@bloghub/ui/components/alert-dialog";
import { Button } from "@bloghub/ui/components/button";
import { useZact } from "@bloghub/zact/client";
import { toast } from "sonner";

import { quitProject } from "~/app/_actions/project/quit-project";
import { type GetProject } from "~/app/_api/projects";
import { Icons } from "~/app/_components/icons";

type Props = {
  project: NonNullable<GetProject>;
};

export function QuitProjectDialog({ project }: Props) {
  const [open, setOpen] = useState(false);

  const { mutate, isRunning } = useZact(quitProject, {
    onSuccess: () => {
      toast.success("You quit the project");
    },
    onServerError: () => {
      toast.error("Something went wrong");
    },
  });

  const onDelete = () =>
    mutate({
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
          <AlertDialogAction disabled={isRunning} onClick={onDelete}>
            {isRunning && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
