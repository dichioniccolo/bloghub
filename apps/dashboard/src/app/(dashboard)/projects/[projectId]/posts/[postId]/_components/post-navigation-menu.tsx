"use client";

import { ArrowLeft } from "lucide-react";
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

interface Props {
  projectId: string;
  postId: string;
}

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
              <ArrowLeft className="mr-2 h-4 w-4" /> Posts
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}
