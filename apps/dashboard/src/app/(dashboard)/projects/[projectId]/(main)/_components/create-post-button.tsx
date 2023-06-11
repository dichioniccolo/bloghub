"use client";

import { Button } from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { createPost } from "~/lib/shared/actions/post/create-post";

type Props = {
  projectId: string;
};

export function CreatePostButton({ projectId }: Props) {
  const user = useUser();

  const { mutate, isRunning } = useZact(createPost);

  const onCreate = () =>
    mutate({
      userId: user.id,
      projectId,
    });

  return (
    <Button onClick={onCreate}>
      {isRunning ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      Create
    </Button>
  );
}
