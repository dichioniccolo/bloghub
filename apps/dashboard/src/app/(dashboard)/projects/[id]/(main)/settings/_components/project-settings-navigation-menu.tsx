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

type Props = {
  projectId: string;
};

export function ProjectSettingsNavigationMenu({ projectId }: Props) {
  const pathname = usePathname();

  const basePath = `/projects/${projectId}/settings`;

  return (
    <NavigationMenu orientation="vertical" className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={basePath} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === basePath}
              className={navigationMenuTriggerStyle()}
            >
              General
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={`${basePath}/members`} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === `${basePath}/members`}
              className={navigationMenuTriggerStyle()}
            >
              Members
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
