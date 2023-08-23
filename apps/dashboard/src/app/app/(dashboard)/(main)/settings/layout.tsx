import type { PropsWithChildren } from "react";

import { DashboardHeader } from "~/components/dashboard-header";
import { DashboardShell } from "~/components/dashboard-shell";
import { SidebarNav } from "~/components/sidebar-nav";
import { AppRoutes } from "~/lib/routes";

const sidebarNavItems = [
  {
    title: "Profile",
    href: AppRoutes.Settings,
  },
  {
    title: "Email Notifications",
    href: AppRoutes.NotificationsSettings,
  },
  {
    title: "Billing",
    href: AppRoutes.BillingSettings,
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
