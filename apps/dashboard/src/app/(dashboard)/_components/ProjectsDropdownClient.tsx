"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui";

import { useCreateProjectDialog } from "~/app/_components/dialogs/create-project-dialog";
import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { type GetProjects } from "~/lib/shared/api/projects";
import { cn, getDefaultAvatarImage } from "~/lib/utils";
import { useSelectedProject } from "./useSelectedProject";

type Props = {
  projects: GetProjects;
};

export function ProjectsDropdownClient({ projects }: Props) {
  const user = useUser();
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
                    : user.image ?? getDefaultAvatarImage(user.email))
                }
                alt={selectedProject?.name ?? user.name ?? user.email}
              />
              <AvatarFallback>
                {selectedProject?.name[0] ?? user.name?.[0] ?? user.email[0]}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              {selectedProject?.name ?? user?.name ?? user.email}
            </span>
            <Icons.chevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
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
                    router.push("/");
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={user.image ?? getDefaultAvatarImage(user.email)}
                      alt={user.name ?? user.email}
                    />
                    <AvatarFallback>
                      {user.name?.[0] ?? user.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.name ?? user.email}</span>
                  <Icons.check
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
                      router.push(`/projects/${project.id}`);
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
                    <Icons.check
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
                  <Icons.plusCircle className="mr-2 h-5 w-5" />
                  Create Project
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>

        {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ProjectsDropdownTrigger projects={projects} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <ProjectsDropdownLinks projects={projects} />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <span className="flex items-center justify-between space-x-3">
              <Icons.plusCircle className="h-4 w-4" />
              <span>Add new project</span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateProjectDialog /> */}
      </Popover>
      <CreateProjectDialog />
    </>
  );
}
