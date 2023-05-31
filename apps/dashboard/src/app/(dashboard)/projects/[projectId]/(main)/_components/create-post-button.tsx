"use client";

import { Button } from "@acme/ui";

import { useCreatePostDialog } from "~/app/_components/dialogs/create-post-dialog";
import { Icons } from "~/app/_components/icons";

type Props = {
  projectId: string;
};

export function CreatePostButton({ projectId }: Props) {
  const { setOpen, CreatePostDialog } = useCreatePostDialog(projectId);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        <Icons.add className="mr-2 h-4 w-4" />
        Create
      </Button>
      <CreatePostDialog />
    </>
  );
}
