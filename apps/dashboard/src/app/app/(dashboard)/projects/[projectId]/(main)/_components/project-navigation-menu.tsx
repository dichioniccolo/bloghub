"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Icons } from "~/app/_components/icons";
import { AppRoutes } from "~/lib/common/routes";

type Props = {
  projectId: string;
};

export function ProjectNavigationMenu({ projectId }: Props) {
  const pathname = usePathname();

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={AppRoutes.Dashboard} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.arrowLeft className="mr-2 h-4 w-4" /> Projects
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={AppRoutes.ProjectDashboard(projectId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={pathname === AppRoutes.ProjectDashboard(projectId)}
              className={navigationMenuTriggerStyle()}
            >
              Posts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={AppRoutes.ProjectStats(projectId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={pathname === AppRoutes.ProjectStats(projectId)}
              className={navigationMenuTriggerStyle()}
            >
              Stats
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href={AppRoutes.ProjectSettings(projectId)}
            legacyBehavior
            passHref
          >
            <NavigationMenuLink
              active={pathname?.startsWith(
                AppRoutes.ProjectSettings(projectId),
              )}
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
