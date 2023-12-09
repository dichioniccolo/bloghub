import { Menu } from "lucide-react";

import { Button } from "@acme/ui/components/button";
import { Link } from "@acme/ui/components/link";
import { ScrollArea, ScrollBar } from "@acme/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@acme/ui/components/sheet";

import { BlogLogo } from "./blog-logo";

interface Props {
  project: {
    name: string;
    logo: string | null;
  };
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
            <h2 className="mb-4 text-sm font-semibold uppercase leading-6 text-slate-500 dark:text-slate-400">
              Blog socials
            </h2>
            <div className="flex flex-row flex-wrap gap-x-6 gap-y-4 text-slate-600 dark:text-slate-200">
              <Link
                href="/"
                target="_blank"
                rel="me noopener"
                className="flex flex-row items-center justify-center rounded-full p-2 ring-blue-600 ring-offset-white transition-colors duration-150 hover:bg-black/10 dark:ring-offset-slate-800 dark:hover:bg-white/20"
              >
                Coming soon...
              </Link>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
