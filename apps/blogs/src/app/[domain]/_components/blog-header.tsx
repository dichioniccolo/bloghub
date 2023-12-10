import { cn } from "@acme/ui";
import { Link } from "@acme/ui/components/link";
import { ScrollArea, ScrollBar } from "@acme/ui/components/scroll-area";

import type { GetProjectByDomain } from "~/app/_api/projects";
import { BlogLeftMenu } from "./blog-left-menu";
import { BlogLogo } from "./blog-logo";
import { BlogSocials } from "./blog-socials";
import { ToggleTheme } from "./toggle-theme";

interface Props {
  project: NonNullable<GetProjectByDomain>;
}

export function BlogHeader({ project }: Props) {
  return (
    <header
      className={cn(
        "relative z-50 w-full border-b border-black/10 bg-white bg-opacity-70 dark:border-white/10 dark:bg-slate-900 dark:bg-opacity-70",
      )}
    >
      <div className="container mx-auto px-2 md:px-4 2xl:px-10">
        <div className="relative z-40 flex flex-row items-center justify-between pb-2 pt-8 md:mb-4">
          <div className="flex flex-row items-center py-1">
            <div className="dark:text-white md:hidden">
              <BlogLeftMenu project={project} />
            </div>
            <div className="hidden md:block">
              <BlogLogo project={project} />
            </div>
          </div>
          <div className="flex flex-row items-center dark:text-white">
            <ToggleTheme />
          </div>
        </div>
        <div className="mx-auto my-5 flex w-2/3 flex-row items-center justify-center md:hidden">
          <BlogLogo project={project} />
        </div>
        <div>
          <div className="mx-0 mb-2 hidden w-full flex-row items-center justify-between md:flex">
            {project.socials.length > 0 && (
              <div className="5 flex flex-row flex-wrap justify-center gap-x-1 gap-y-2 text-slate-700 dark:text-slate-300">
                <BlogSocials socials={project.socials} />
              </div>
            )}
            <div className="mb-0 ml-auto flex flex-row items-center justify-center gap-x-3">
              {/* other actions */}
            </div>
          </div>
          <div className="mb-2 flex w-full flex-col items-center md:hidden">
            <div className="mb-6 flex flex-row items-center justify-center gap-x-3">
              {/* other actions, same as above */}
            </div>
            {project.socials.length > 0 && (
              <div className="relative mt-8 hidden flex-row items-center justify-center overflow-hidden text-base md:flex">
                <BlogSocials socials={project.socials} />
              </div>
            )}
          </div>
          <div className="relative mt-8 hidden flex-row items-center justify-center overflow-hidden text-base md:flex">
            <ScrollArea>
              <nav className="relative flex flex-row flex-nowrap items-end whitespace-nowrap px-2 pt-2">
                <Link
                  href="/"
                  className="group flex items-center justify-center border-b-2 border-transparent px-2 capitalize focus:outline-none"
                >
                  <span className="mb-2 block rounded-lg px-2 py-1 font-semibold text-slate-900 text-opacity-100 ring-offset-2 transition-colors duration-150 hover:bg-slate-100 group-focus:ring group-focus:ring-blue-600 group-focus:ring-offset-white dark:text-white dark:text-opacity-100 dark:hover:bg-slate-800 dark:group-focus:ring-offset-slate-800">
                    Home
                  </span>
                </Link>
              </nav>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </header>
  );
}
