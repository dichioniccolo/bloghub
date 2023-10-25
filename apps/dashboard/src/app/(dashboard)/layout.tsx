import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import Link from "next/link";

import { auth } from "@acme/auth";
import { AppRoutes } from "@acme/lib/routes";
import { Skeleton } from "@acme/ui/components/skeleton";
import { Divider } from "@acme/ui/icons/divider";
import { Logo } from "@acme/ui/icons/logo";

import { CommandMenu } from "~/components/command-menu";
import { Notifications } from "~/components/notifications";
import { NotificationsPlaceholder } from "~/components/notifications/notifications-placeholder";
import { env } from "~/env.mjs";
import { ProjectsDropdown } from "./_components/projects-dropdown";
import { UserDropdown } from "./_components/user-dropdown";
import { DashboardProviders } from "./providers";

export default async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <DashboardProviders>
      <div className="mx-auto flex flex-col">
        <header className="container sticky top-0 z-40 bg-background">
          <div className="flex h-16 items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                href={AppRoutes.Dashboard}
                aria-label={`${env.NEXT_PUBLIC_APP_NAME} logo`}
              >
                <Logo
                  alt={env.NEXT_PUBLIC_APP_NAME}
                  className="h-10 w-10 rounded-full transition-all duration-75 active:scale-95"
                />
              </Link>
              <Divider className="h-10 w-10 text-primary" />
              <Suspense
                fallback={<Skeleton className="h-12 w-48 rounded-3xl" />}
              >
                <ProjectsDropdown session={session} />
              </Suspense>
            </div>
            <div className="flex items-center gap-2">
              <CommandMenu />
              <Suspense fallback={<NotificationsPlaceholder />}>
                <Notifications session={session} />
              </Suspense>
              <UserDropdown session={session} />
            </div>
          </div>
        </header>
        <div className="container grid gap-12 bg-background">
          <main className="flex-w-full flex-1 flex-col">{children}</main>
        </div>
      </div>
    </DashboardProviders>
  );
}
