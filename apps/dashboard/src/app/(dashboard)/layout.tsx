import { Suspense, type PropsWithChildren } from "react";
import Link from "next/link";

import { Skeleton } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { ProjectsDropdown } from "./_components/ProjectsDropdown";
import { UserDropdown } from "./_components/UserDropdown";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex flex-col">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/">
              <Icons.logo className="h-10 w-10 rounded-full transition-all duration-75 active:scale-95" />
            </Link>
            <Icons.divider className="h-10 w-10 text-slate-200 sm:ml-3" />
            <Suspense fallback={<Skeleton className="h-12 w-48 rounded-3xl" />}>
              {/* @ts-expect-error react async component */}
              <ProjectsDropdown />
            </Suspense>
          </div>
          <UserDropdown />
        </div>
      </header>
      <div className="container grid gap-12">
        <main className="flex-w-full flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
