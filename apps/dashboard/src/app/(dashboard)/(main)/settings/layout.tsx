import { type PropsWithChildren } from "react";

import { DashboardHeader } from "~/app/_components/dashboard-header";
import { DashboardShell } from "~/app/_components/dashboard-shell";
import { Routes } from "~/app/routes";
import { SidebarNav } from "../../../_components/sidebar-nav";

const sidebarNavItems = [
  {
    title: "Profile",
    href: Routes.Settings,
  },
  {
    title: "Email Notifications",
    href: Routes.NotificationsSettings,
  },
  {
    title: "Billing",
    href: Routes.BillingSettings,
  },
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
