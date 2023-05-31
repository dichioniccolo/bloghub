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
import { Routes } from "~/app/routes";

type Props = {
  projectId: string;
  postId: string;
};

export function PostNavigationMenu({ projectId, postId }: Props) {
  const pathname = usePathname();

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            href={Routes.ProjectDashboard(projectId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.arrowLeft className="mr-2 h-4 w-4" /> Posts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={Routes.PostEditor(projectId, postId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={pathname === Routes.PostEditor(projectId, postId)}
              className={navigationMenuTriggerStyle()}
            >
              Editor
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={Routes.PostStats(projectId, postId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={pathname === Routes.PostStats(projectId, postId)}
              className={navigationMenuTriggerStyle()}
            >
              Stats
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
