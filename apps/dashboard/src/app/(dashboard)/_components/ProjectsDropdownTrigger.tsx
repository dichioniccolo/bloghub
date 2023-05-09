"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { useSession } from "next-auth/react";

import { Avatar, AvatarImage, BlurImage, Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { type GetProjects } from "~/lib/shared/gets";
import { useSelectedProject } from "./useSelectedProject";

type Props = ComponentPropsWithoutRef<"button"> & {
  projects: GetProjects;
};

export const ProjectsDropdownTrigger = forwardRef<HTMLButtonElement, Props>(
  function ProjectsDropdownTrigger({ projects, ...props }, ref) {
    const session = useSession();

    const selectedProject = useSelectedProject(projects);

    if (!session?.data?.user) return null;

    return (
      <Button
        {...props}
        ref={ref}
        variant="ghost"
        className="relative h-12 w-48 rounded-3xl"
      >
        <span className="flex items-center justify-between space-x-3">
          {selectedProject ? (
            <BlurImage
              src={
                selectedProject.logo ??
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAIhJREFUaEPt0sEJACEQBEHNP7XNSYOohwh9/1mw6/bMnPXxt3vAY70EHgOsBBLAAv1CGJDnCXBCPJAABuR5ApwQDySAAXmeACfEAwlgQJ4nwAnxQAIYkOcJcEI8kAAG5HkCnBAPJIABeZ4AJ8QDCWBAnifACfFAAhiQ5wlwQjyQAAbkeQKcEA9cSuOiwSGdZ9oAAAAASUVORK5CYII="
              }
              alt={selectedProject.name}
              className="h-6 w-6 overflow-hidden rounded-full sm:h-8 sm:w-8"
              width={48}
              height={48}
            />
          ) : (
            <Avatar>
              <AvatarImage
                alt={session.data.user.email}
                src={
                  session.data.user.image ??
                  `https://api.dicebear.com/6.x/adventurer/svg?seed=${session.data.user.email}`
                }
              />
            </Avatar>
          )}
          <span className="block w-32 truncate text-left text-sm font-medium">
            {selectedProject?.name ?? session.data.user.email}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2">
          <Icons.chevronsUpDown
            className="h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Button>
    );
  },
);
