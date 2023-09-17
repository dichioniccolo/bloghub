"use client";

import { Check, Monitor, Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";

const appearances = [
  {
    theme: "System",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    theme: "Light",
    icon: <SunDim className="h-4 w-4" />,
  },
  {
    theme: "Dark",
    icon: <Moon className="h-4 w-4" />,
  },
];

export function ToggleTheme() {
  const { theme: currentTheme, setTheme } = useTheme();

  const icon = appearances.find(
    (appearance) => appearance.theme.toLowerCase() === currentTheme,
  )?.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-stone-100 active:bg-stone-200">
        {icon}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="end">
        {appearances.map(({ theme, icon }) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => {
              setTheme(theme.toLowerCase());
            }}
          >
            <div className="flex items-center space-x-2">
              <span>{icon}</span>
              <span>{theme}</span>
            </div>

            {currentTheme === theme.toLowerCase() && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
