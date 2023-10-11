import type { PropsWithChildren } from "react";

import { PostNavigationMenu } from "./_components/post-navigation-menu";

interface Props {
  params: {
    projectId: string;
    postId: string;
  };
}

export default function Layout({
  params: { projectId, postId },
  children,
}: PropsWithChildren<Props>) {
  return (
    <>
      <PostNavigationMenu projectId={projectId} postId={postId} />
      {children}
    </>
  );
}
