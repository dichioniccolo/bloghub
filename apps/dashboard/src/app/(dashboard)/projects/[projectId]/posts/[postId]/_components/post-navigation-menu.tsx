"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppRoutes } from "@acme/common/routes";
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
  postId: string;
};

export function PostNavigationMenu({ projectId, postId }: Props) {
  const pathname = usePathname();

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link
            href={AppRoutes.ProjectDashboard(projectId)}
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
            href={AppRoutes.PostEditor(projectId, postId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={pathname === AppRoutes.PostEditor(projectId, postId)}
              className={navigationMenuTriggerStyle()}
            >
              Editor
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={AppRoutes.PostStats(projectId, postId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={pathname === AppRoutes.PostStats(projectId, postId)}
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
