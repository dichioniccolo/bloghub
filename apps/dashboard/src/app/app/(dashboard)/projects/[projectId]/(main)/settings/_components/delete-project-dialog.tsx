"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { deleteProject } from "~/app/_actions/project/delete-project";
import type { GetProject } from "~/app/_api/projects";
import { useZact } from "~/lib/zact/client";

type Props = {
  project: NonNullable<GetProject>;
};

export function DeleteProjectDialog({ project }: Props) {
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
            {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
