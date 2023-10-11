"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellRing,
  Euro,
  LogOut,
  Monitor,
  Moon,
  Plus,
  SunDim,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

import { AppRoutes } from "@acme/lib/routes";
import { cn } from "@acme/ui";
import { Button } from "@acme/ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@acme/ui/components/command";

import { useCreateProjectDialog } from "./dialogs/create-project-dialog";

export function CommandMenu() {
  const router = useRouter();

  const { setTheme } = useTheme();

  const { setOpen: setCreateProjectDialogOpen, CreateProjectDialog } =
    useCreateProjectDialog();

  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       setOpen(true);
  //     }
  //   };

  //   document.addEventListener("keydown", down);

  //   return () => document.removeEventListener("keydown", down);
  // }, []);

  const runCommand = useCallback((command: () => unknown) => {
    return () => {
      setOpen(false);
      command();
    };
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Quick access...</span>
        <span className="inline-flex lg:hidden">Quick access...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Projects">
            <CommandItem
              onSelect={runCommand(() => setCreateProjectDialogOpen(true))}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Theme">
            <CommandItem onSelect={runCommand(() => setTheme("light"))}>
              <SunDim className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={runCommand(() => setTheme("system"))}>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="General">
            <CommandItem
              onSelect={runCommand(() => router.push(AppRoutes.Settings))}
            >
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </CommandItem>
            <CommandItem
              onSelect={runCommand(() =>
                router.push(AppRoutes.NotificationsSettings),
              )}
            >
              <BellRing className="mr-2 h-4 w-4" />
              Email Notifications
            </CommandItem>
            <CommandItem
              onSelect={runCommand(() =>
                router.push(AppRoutes.BillingSettings),
              )}
            >
              <Euro className="mr-2 h-4 w-4" />
              Billing
            </CommandItem>
            <CommandItem onSelect={runCommand(() => signOut())}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <CreateProjectDialog />
    </>
  );
}
