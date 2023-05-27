import { type PropsWithChildren } from "react";

import { DashboardHeader } from "~/app/_components/dashboard-header";
import { DashboardShell } from "~/app/_components/dashboard-shell";
import { SidebarNav } from "../../../_components/sidebar-nav";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  // {
  //   title: "Billing",
  //   href: "/settings/billing",
  // },
];

export default function Layout({ children }: PropsWithChildren) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Personal Settings" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </DashboardShell>
  );
}
