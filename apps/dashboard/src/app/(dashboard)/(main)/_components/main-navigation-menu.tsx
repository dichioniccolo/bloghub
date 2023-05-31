"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@acme/ui";

import { Routes } from "~/app/routes";

export function MainNavigationMenu() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={Routes.Dashboard} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === Routes.Dashboard}
              className={navigationMenuTriggerStyle()}
            >
              Projects
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={Routes.Settings} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname.startsWith(Routes.Settings)}
              className={navigationMenuTriggerStyle()}
            >
              Settings
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
