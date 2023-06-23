"use client";

import { useState } from "react";

import { deleteProject } from "@acme/common/actions";
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
  Button,
  toast,
} from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { type GetProject } from "~/app/_api/projects";
import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";

type Props = {
  project: NonNullable<GetProject>;
};

export function DeleteProjectDialog({ project }: Props) {
  const user = useUser();

  const [open, setOpen] = useState(false);

  const { mutate, isRunning } = useZact(deleteProject, {
    onSuccess: () => {
      toast.success("Project deleted");
    },
    onServerError: () => {
      toast.error("Something went wrong");
    },
  });

  const onDelete = () =>
    mutate({
      projectId: project.id,
      userId: user.id,
    });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            Warning: This will permanently delete your project, custom domain,
            and all associated posts + their stats.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isRunning}>
            {isRunning && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
