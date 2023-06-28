"use client";

import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useUser } from "~/hooks/use-user";
import { AppRoutes } from "~/lib/common/routes";
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
          <Link href={AppRoutes.Settings}>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
