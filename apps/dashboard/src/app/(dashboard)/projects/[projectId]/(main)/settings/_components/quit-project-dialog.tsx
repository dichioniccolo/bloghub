"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppRoutes } from "@acme/lib/routes";
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
import { useZact } from "~/lib/zact/client";

interface Props {
  project: NonNullable<GetProject>;
}

export function QuitProjectDialog({ project }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { mutate, isRunning } = useZact(quitProject, {
    onSuccess: () => {
      toast.success("You quit the project");
      router.replace(AppRoutes.Dashboard);
      router.refresh();
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
            {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
