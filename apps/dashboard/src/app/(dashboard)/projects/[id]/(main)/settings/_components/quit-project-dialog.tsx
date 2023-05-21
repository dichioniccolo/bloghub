"use client";

import { useState, useTransition } from "react";

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
import { quitProject } from "~/lib/shared/actions/quit-project";
import { type GetProject } from "~/lib/shared/api/projects";
import { useZact } from "~/lib/zact/client";

type Props = {
  project: NonNullable<GetProject>;
};

export function QuitProjectDialog({ project }: Props) {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  const { mutate } = useZact(quitProject);

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
            disabled={loading}
            onClick={() =>
              startTransition(async () => {
                try {
                  const result = await mutate({
                    userId: user.id,
                    projectId: project.id,
                  });

                  if (!result) {
                    return;
                  }

                  toast({
                    title: "You quit the project.",
                  });
                } catch {
                  toast({
                    title: "Something went wrong.",
                    variant: "destructive",
                  });
                }
              })
            }
          >
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
