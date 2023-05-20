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

import { useUser } from "~/hooks/use-user";
import { type GetProject } from "~/lib/shared/api/projects";
import { useZact } from "~/lib/zact/client";
import { quitProject } from "../../../../../../../lib/shared/actions/quit-project";

type Props = {
  project: NonNullable<GetProject>;
};

export function QuitProjectDialog({ project }: Props) {
  const user = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
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

                  setOpen(false);

                  toast({
                    title: "You quit the project.",
                  });

                  router.push("/");
                } catch {
                  //
                }
              })
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
