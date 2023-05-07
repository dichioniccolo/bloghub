"use client";

import { type Project } from "@acme/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui";

import { useCreateProjectDialog } from "~/components/dialogs/create-project-dialog";
import { Icons } from "~/components/icons";
import { ProjectsDropdownTrigger } from "./ProjectsDropdownTrigger";

type Props = {
  projects: Project[];
};

export function ProjectsDropdownClient({ projects }: Props) {
  const { setOpen, CreateProjectDialog } = useCreateProjectDialog();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ProjectsDropdownTrigger projects={projects} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <span className="flex items-center justify-between space-x-3">
              <Icons.plusCircle className="h-4 w-4" />
              <span>Add new project</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateProjectDialog />
    </>
  );
}
