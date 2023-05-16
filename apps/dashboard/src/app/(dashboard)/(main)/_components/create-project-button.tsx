"use client";

import { Button } from "@acme/ui";

import { useCreateProjectDialog } from "~/app/_components/dialogs/create-project-dialog";
import { Icons } from "~/app/_components/icons";

export function CreateProjectButton() {
  const { setOpen, CreateProjectDialog } = useCreateProjectDialog();

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" />
        Create
      </Button>
      <CreateProjectDialog />
    </>
  );
}
