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
  postId: string;
};

export function PostNavigationMenu({ projectId, postId }: Props) {
  const pathname = usePathname();

  const basePath = `/projects/${projectId}/post/${postId}`;

  return (
    <NavigationMenu className="justify-start">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href={`/projects/${projectId}`} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Icons.arrowLeft className="mr-2 h-4 w-4" /> Posts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href={basePath} legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === basePath}
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
