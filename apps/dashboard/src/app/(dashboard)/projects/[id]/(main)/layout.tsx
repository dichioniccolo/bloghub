import { type PropsWithChildren } from "react";

import { ProjectNavigationMenu } from "./_components/project-navigation-menu";

type Props = PropsWithChildren<{
  params: {
    id: string;
  };
}>;

export default function Layout({ children, params: { id } }: Props) {
  return (
    <>
      <ProjectNavigationMenu projectId={id} />
      {children}
    </>
  );
}
