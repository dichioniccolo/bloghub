"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import type { Session } from "@acme/auth";
import { AppRoutes } from "@acme/lib/routes";
import { getDefaultAvatarImage } from "@acme/lib/utils";
import { cn } from "@acme/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/avatar";
import { Button } from "@acme/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@acme/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui/components/popover";

import type { GetProjects } from "~/app/_api/projects";
import { useCreateProjectDialog } from "~/components/dialogs/create-project-dialog";
import { useSelectedProject } from "./use-selected-project";

interface Props {
  session: Session;
  projects: GetProjects;
}

export function ProjectsDropdownClient({ session, projects }: Props) {
  const [open, setOpen] = useState(false);

  const selectedProject = useSelectedProject(projects);

  const router = useRouter();
  const { setOpen: setShowCreateProjectDialog, CreateProjectDialog } =
    useCreateProjectDialog();

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a project"
            className="w-[200px] justify-between"
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={
                  selectedProject?.logo ??
                  (selectedProject
                    ? getDefaultAvatarImage(selectedProject.name)
                    : session.user.picture ??
                      getDefaultAvatarImage(session.user.email))
                }
                alt={
                  selectedProject?.name ??
                  session.user.name ??
                  session.user.email
                }
              />
              <AvatarFallback>
                {selectedProject?.name[0] ??
                  session.user.name?.[0] ??
                  session.user.email[0]}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              {selectedProject?.name ?? session.user.name ?? session.user.email}
            </span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search project..." />
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup heading="Personal Account">
                <CommandItem
                  onSelect={() => {
                    router.push(AppRoutes.Dashboard);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={
                        session.user.picture ??
                        getDefaultAvatarImage(session.user.email)
                      }
                      alt={session.user.name ?? session.user.email}
                    />
                    <AvatarFallback>
                      {session.user.name?.[0] ?? session.user.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {session.user.name ?? session.user.email}
                  </span>
                  <Check
                    className={cn("ml-auto h-4 w-4", {
                      "opacity-100": !selectedProject,
                      "opacity-0": !!selectedProject,
                    })}
                  />
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Projects">
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      router.push(AppRoutes.ProjectDashboard(project.id));
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={
                          project.logo ?? getDefaultAvatarImage(project.name)
                        }
                        alt={project.name}
                      />
                      <AvatarFallback>{project.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{project.name}</span>
                    <Check
                      className={cn("ml-auto h-4 w-4", {
                        "opacity-100": selectedProject?.id === project.id,
                        "opacity-0": selectedProject?.id !== project.id,
                      })}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowCreateProjectDialog(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Project
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateProjectDialog />
    </>
  );
}
