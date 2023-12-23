"use client";

import { Monitor, Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@acme/ui/components/ui/button";
import { useMounted } from "@acme/ui/hooks/use-mounted";

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
  const mounted = useMounted();
  const { theme, setTheme, systemTheme } = useTheme();

  if (!mounted) {
    return null;
  }

  const currentTheme =
    theme !== "system" && systemTheme !== theme ? theme : systemTheme; // we do not want to show the system theme as a theme option

  const icon = appearances.find(
    (appearance) => appearance.theme.toLowerCase() === currentTheme,
  )?.icon;

  return (
    <Button
      variant="outline"
      className="flex flex-row items-center rounded-full p-2 font-medium transition duration-100 ease-in-out hover:bg-black/10 dark:hover:bg-white/20"
      onClick={() => {
        setTheme(currentTheme === "light" ? "dark" : "light");
      }}
    >
      {icon}
    </Button>
  );
}
