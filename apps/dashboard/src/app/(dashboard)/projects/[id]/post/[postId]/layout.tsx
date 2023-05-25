import { type PropsWithChildren } from "react";

import { PostNavigationMenu } from "./_components/post-navigation-menu";

type Props = {
  params: {
    id: string;
    postId: string;
  };
};

export default function Layout({
  params: { id, postId },
  children,
}: PropsWithChildren<Props>) {
  return (
    <>
      <PostNavigationMenu projectId={id} postId={postId} />
      {children}
    </>
  );
}
