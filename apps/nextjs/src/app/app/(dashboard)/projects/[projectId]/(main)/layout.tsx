import type { PropsWithChildren } from "react";

import { ProjectNavigationMenu } from "./_components/project-navigation-menu";

type Props = PropsWithChildren<{
  params: {
    projectId: string;
  };
}>;

export default function Layout({ children, params: { projectId } }: Props) {
  return (
    <>
      <ProjectNavigationMenu projectId={projectId} />
      {children}
    </>
  );
}
