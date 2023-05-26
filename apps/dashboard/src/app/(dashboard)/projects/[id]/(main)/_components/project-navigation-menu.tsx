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

import { Icons } from "~/app/_components/icons";

type Props = {
  projectId: string;
};

export function ProjectNavigationMenu({ projectId }: Props) {
  const pathname = usePathname();

  const basePath = `/projects/${projectId}`;

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.arrowLeft className="mr-2 h-4 w-4" /> Projects
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={basePath} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === basePath}
              className={navigationMenuTriggerStyle()}
            >
              Posts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`${basePath}/settings`} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname?.startsWith(`${basePath}/settings`)}
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
