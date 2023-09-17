"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/components/dialog";

import { CreateProjectForm } from "../forms/create-project-form";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function CreateProjectDialog({ open, setOpen }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <span>Create a new project</span>
          </DialogTitle>
        </DialogHeader>
        <CreateProjectForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

export function useCreateProjectDialog() {
  const [open, setOpen] = useState(false);

  const CreateProjectDialogCallback = useCallback(
    () => <CreateProjectDialog open={open} setOpen={setOpen} />,
    [open, setOpen],
  );

  return {
    setOpen,
    CreateProjectDialog: CreateProjectDialogCallback,
  };
}
