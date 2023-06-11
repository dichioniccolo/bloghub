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
  Button,
  useToast,
} from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { deleteProject } from "~/lib/shared/actions/project/delete-project";
import { type GetProject } from "~/lib/shared/api/projects";

type Props = {
  project: NonNullable<GetProject>;
};

export function DeleteProjectDialog({ project }: Props) {
  const user = useUser();

  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const { mutate, isRunning } = useZact(deleteProject, {
    onSuccess: () => {
      toast({
        title: "Project deleted",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
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
