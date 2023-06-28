import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import Link from "next/link";

import { Skeleton } from "~/components/ui/skeleton";
import { Divider } from "~/app/_components/icons/divider";
import { Logo } from "~/app/_components/icons/logo";
import { env } from "~/env.mjs";
import { AppRoutes } from "~/lib/common/routes";
import { CommandMenu } from "../../_components/command-menu";
import { Notifications } from "../../_components/notifications";
import { NotificationsPlaceholder } from "../../_components/notifications/notifications-placeholder";
import { ProjectsDropdown } from "./_components/projects-dropdown";
import { UserDropdown } from "./_components/user-dropdown";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex flex-col">
      <header className="container sticky top-0 z-40 bg-background">
        <div className="flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <Link
              href={AppRoutes.Dashboard}
              aria-label={`${env.NEXT_PUBLIC_APP_NAME} logo`}
            >
              <Logo className="h-10 w-10 rounded-full transition-all duration-75 active:scale-95" />
            </Link>
            <Divider className="h-10 w-10 text-primary sm:ml-3" />
            <Suspense fallback={<Skeleton className="h-12 w-48 rounded-3xl" />}>
              <ProjectsDropdown />
            </Suspense>
          </div>
          <div className="flex items-center gap-2">
            <CommandMenu />
            <Suspense fallback={<NotificationsPlaceholder />}>
              <Notifications />
            </Suspense>
            <UserDropdown />
          </div>
        </div>
      </header>
      <div className="container grid gap-12 bg-background">
        <main className="flex-w-full flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
