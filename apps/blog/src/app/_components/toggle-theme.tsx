"use client";

import { useTheme } from "next-themes";

import { Button } from "@acme/ui";

import { Icons } from "~/app/_components/icons";

export function ToggleTheme() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="ghost"
        size="sm"
        className="hidden rounded-full dark:block"
        onClick={() => setTheme("light")}
      >
        <Icons.sun />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="block rounded-full dark:hidden"
        onClick={() => setTheme("dark")}
      >
        <Icons.moon />
      </Button>
    </div>
  );
}
