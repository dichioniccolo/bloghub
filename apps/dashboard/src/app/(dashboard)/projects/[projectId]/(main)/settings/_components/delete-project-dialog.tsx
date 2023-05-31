"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { deleteProject } from "~/lib/shared/actions/delete-project";
import { type GetProject } from "~/lib/shared/api/projects";
import { useZact } from "~/lib/zact/client";

type Props = {
  project: NonNullable<GetProject>;
};

export function DeleteProjectDialog({ project }: Props) {
  const user = useUser();

  const { toast } = useToast();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();

  const { mutate } = useZact(deleteProject);

  const onDelete = () =>
    startTransition(async () => {
      try {
        await mutate({
          projectId: project.id,
          userId: user.id,
        });

        toast({
          title: "Project deleted.",
        });

        router.push("/");
      } catch {
        toast({
          title: "Something went wrong.",
          variant: "destructive",
        });
      }
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
          <AlertDialogAction onClick={onDelete}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
