"use client";

import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useCreateProjectDialog } from "~/app/_components/dialogs/create-project-dialog";

export function CreateProjectButton() {
  const { setOpen, CreateProjectDialog } = useCreateProjectDialog();

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create
      </Button>
      <CreateProjectDialog />
    </>
  );
}
