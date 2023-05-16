import { type PropsWithChildren } from "react";

import { MainNavigationMenu } from "./_components/main-navigation-menu";

export default function AppDashboardMainLayout({
  children,
}: PropsWithChildren) {
  return (
    <>
      <MainNavigationMenu />
      {children}
    </>
  );
}
