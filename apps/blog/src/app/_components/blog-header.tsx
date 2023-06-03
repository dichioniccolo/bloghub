import Link from "next/link";

import { BlurImage } from "@acme/ui";

import { getProjectByDomain } from "../actions/projects";
import { ToggleTheme } from "./toggle-theme";

type Props = {
  domain: string;
};

export async function BlogHeader({ domain }: Props) {
  const project = await getProjectByDomain(domain);

  if (!project) {
    return null;
  }

  return (
    <div className="ease sticky left-0 right-0 top-0 z-30 flex h-16 items-center justify-between bg-background px-20 shadow-md">
      <div className="flex h-full">
        <Link
          href="/"
          className="flex items-center justify-center space-x-3"
          aria-label={project.name}
        >
          {project.logo && (
            <span className="inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
              <BlurImage
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
      <div className="flex h-full ">
        <ToggleTheme />
      </div>
    </div>
  );
}
