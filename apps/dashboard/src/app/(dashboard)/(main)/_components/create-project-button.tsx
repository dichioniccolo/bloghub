"use client";

import { Plus } from "lucide-react";

import type { ButtonProps } from "@acme/ui/components/ui/button";
import { Button } from "@acme/ui/components/ui/button";

import { useCreateProjectDialog } from "~/components/dialogs/create-project-dialog";

interface Props {
  buttonProps?: Omit<ButtonProps, "onClick">;
}

export function CreateProjectButton({ buttonProps }: Props) {
  const { setOpen, CreateProjectDialog } = useCreateProjectDialog();

  return (
    <>
      <Button onClick={() => setOpen(true)} {...(buttonProps ?? {})}>
        <Plus className="mr-2 h-4 w-4" />
        Create
      </Button>
      <CreateProjectDialog />
    </>
  );
}
