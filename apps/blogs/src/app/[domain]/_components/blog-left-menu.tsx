import { Menu } from "lucide-react";

import { Link } from "@acme/ui/components/link";
import { Button } from "@acme/ui/components/ui/button";
import { ScrollArea, ScrollBar } from "@acme/ui/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@acme/ui/components/ui/sheet";

import type { GetProjectByDomain } from "~/app/_api/projects";
import { BlogLogo } from "./blog-logo";
import { BlogSocials } from "./blog-socials";

interface Props {
  project: NonNullable<GetProjectByDomain>;
}

export function BlogLeftMenu({ project }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <BlogLogo project={project} />
        </SheetHeader>
        <ScrollArea>
          <div className="py-10">
            <h2 className="mb-4 text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">
              Blog menu
            </h2>
            <nav className="pb-8">
              <Link
                href="/"
                className="mb-1 flex w-full flex-row items-center justify-between rounded p-3 font-medium text-slate-700 transition-colors duration-100 hover:bg-slate-100 active:opacity-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Home</span>
              </Link>
            </nav>
            {project.socials.length > 0 && (
              <>
                <h2 className="mb-4 text-sm font-semibold uppercase leading-6 text-slate-500 dark:text-slate-400">
                  Blog socials
                </h2>
                <div className="flex flex-col flex-wrap gap-2 text-slate-600 dark:text-slate-200">
                  <BlogSocials
                    showValue
                    socials={project.socials}
                    className="items-center justify-start"
                  />
                </div>
              </>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
