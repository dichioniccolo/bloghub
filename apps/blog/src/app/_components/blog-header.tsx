"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@bloghub/ui";
import { useScroll } from "@bloghub/ui/hooks/use-scroll";

import { type GetProjectByDomain } from "../_actions/projects";

type Props = {
  project: NonNullable<GetProjectByDomain>;
};

export function BlogHeader({ project }: Props) {
  const scrolled = useScroll(80);

  return (
    <header
      className={cn(
        "ease sticky inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-background px-20 transition-all",
        {
          "border-b border-border bg-background/75 shadow-md": scrolled,
        },
      )}
    >
      <div className="flex h-full">
        <Link
          href="/"
          className="flex items-center justify-center space-x-3"
          aria-label={project.name}
        >
          {project.logo && (
            <span className="inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
              <Image
                height={40}
                width={40}
                src={project.logo}
                alt={project.name}
              />
            </span>
          )}
          <span className="inline-block truncate font-medium">
            {project.name}&apos;s blog
          </span>
        </Link>
      </div>
      <div className="flex h-full ">{/* <ToggleTheme /> */}</div>
    </header>
  );
}
