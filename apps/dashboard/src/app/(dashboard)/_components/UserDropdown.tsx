"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { Routes } from "~/app/routes";
import { useUser } from "~/hooks/use-user";
import { getDefaultAvatarImage } from "~/lib/utils";

export function UserDropdown() {
  const user = useUser();

  const onLogout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-12 w-12 rounded-full">
          <Avatar>
            <AvatarImage
              alt={user.name ?? user.email}
              src={user.image ?? getDefaultAvatarImage(user.name ?? user.email)}
              className="h-10 w-10 rounded-full"
            />
            <AvatarFallback>{user.name ?? user.email}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" forceMount align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={Routes.Settings}>
            <DropdownMenuItem>
              <Icons.settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={onLogout}>
            <Icons.logOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
