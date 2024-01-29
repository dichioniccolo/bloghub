"use client";

import { usePathname } from "next/navigation";

import { AppRoutes } from "@acme/lib/routes";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@acme/ui/components/ui/navigation-menu";
import Link from "next-link";

export function MainNavigationMenu() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={AppRoutes.Dashboard} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === AppRoutes.Dashboard}
              className={navigationMenuTriggerStyle()}
            >
              Projects
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={AppRoutes.Settings} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname.startsWith(AppRoutes.Settings)}
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
