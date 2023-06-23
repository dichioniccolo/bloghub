"use client";

import { useRouter } from "next/navigation";

import { Button } from "@acme/ui";
import { useZact } from "@acme/zact/client";

import { createPost } from "~/app/_actions/post/create-post";
import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";

type Props = {
  projectId: string;
};

export function CreatePostButton({ projectId }: Props) {
  const user = useUser();

  const router = useRouter();

  const { mutate, isRunning } = useZact(createPost, {
    onSuccess: (post) => {
      router.push(`/projects/${projectId}/posts/${post.id}`);
    },
  });

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
