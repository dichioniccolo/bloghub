import { LogOut, Settings } from "lucide-react";

import type { Session } from "@acme/auth";
import { signOut } from "@acme/auth";
import { AppRoutes } from "@acme/lib/routes";
import { getDefaultAvatarImage } from "@acme/lib/utils";
import { Link } from "@acme/ui/components/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/components/ui/avatar";
import { Button } from "@acme/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/components/ui/dropdown-menu";

interface Props {
  session: Session;
}

export function UserDropdown({ session }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-12 w-12 rounded-full">
          <Avatar>
            <AvatarImage
              alt={session.user.name ?? session.user.email}
              src={
                session.user.picture ??
                getDefaultAvatarImage(session.user.name ?? session.user.email)
              }
              className="h-10 w-10 rounded-full"
            />
            <AvatarFallback>
              {session.user.name ?? session.user.email}
            </AvatarFallback>
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
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <DropdownMenuItem asChild>
              <button className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
