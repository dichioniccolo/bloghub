"use client";

import { Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { createPost } from "~/lib/shared/actions/create-post";
import { useZact } from "~/lib/zact/client";

type Props = {
  projectId: string;
};

export function CreatePostButton({ projectId }: Props) {
  const user = useUser();

  const { mutate, isRunning } = useZact(createPost);

  return (
    <Button
      onClick={() =>
        mutate({
          userId: user.id,
          projectId,
        })
      }
    >
      {isRunning ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      Create
    </Button>
  );
}
