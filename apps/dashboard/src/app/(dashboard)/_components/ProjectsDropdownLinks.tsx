"use client";

import Link from "next/link";

import { BlurImage, DropdownMenuItem, DropdownMenuShortcut } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { type GetProjects } from "~/lib/shared/api/projects";
import { cn } from "~/lib/utils";
import { useSelectedProject } from "./useSelectedProject";

type Props = {
  projects: GetProjects;
};

export function ProjectsDropdownLinks({ projects }: Props) {
  const selectedProject = useSelectedProject(projects);

  return (
    <>
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <DropdownMenuItem>
            <span className="flex items-center justify-between space-x-3">
              <BlurImage
                src={
                  project.logo ??
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAIhJREFUaEPt0sEJACEQBEHNP7XNSYOohwh9/1mw6/bMnPXxt3vAY70EHgOsBBLAAv1CGJDnCXBCPJAABuR5ApwQDySAAXmeACfEAwlgQJ4nwAnxQAIYkOcJcEI8kAAG5HkCnBAPJIABeZ4AJ8QDCWBAnifACfFAAhiQ5wlwQjyQAAbkeQKcEA9cSuOiwSGdZ9oAAAAASUVORK5CYII="
                }
                alt={project.name}
                className="h-6 w-6 rounded-full"
                width={24}
                height={24}
              />
              <span
                className={cn("block w-32 truncate text-sm", {
                  "font-medium": project.id === selectedProject?.id,
                  "font-normal": project.id !== selectedProject?.id,
                })}
              >
                {project.name}
              </span>
            </span>
            {project.id === selectedProject?.id && (
              <DropdownMenuShortcut>
                <Icons.check className="h-5 w-5" aria-hidden />
              </DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        </Link>
      ))}
    </>
  );
}
