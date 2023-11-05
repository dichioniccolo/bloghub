"use client";

import { formatDistance } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";

import type { Role } from "@acme/db";
import { getDefaultAvatarImage } from "@acme/lib/utils";
import { Avatar, AvatarImage } from "@acme/ui/components/avatar";
import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";

import type { GetProjectInvites } from "~/app/_api/projects";
import { useDeleteInvitationDialog } from "./delete-invitation-dialog";

interface Props {
  projectId: string;
  currentUserRole: Role;
  invite: GetProjectInvites[number];
}

export function ProjectInvitation({
  projectId,
  currentUserRole,
  invite,
}: Props) {
  const { setOpen, DeleteInvitationDialog } = useDeleteInvitationDialog(
    projectId,
    invite,
  );

  return (
    <>
      <div className="flex items-center justify-between space-x-3 py-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              alt={invite.email ?? "User"}
              src={getDefaultAvatarImage(invite.email ?? "")}
            />
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">{invite.email}</h3>
          </div>
          {invite.expiresAt < new Date() && (
            <Badge variant="destructive">Expired</Badge>
          )}
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex flex-col">
            <p className="text-xs text-stone-500">
              Invited{" "}
              {formatDistance(invite.createdAt, new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xxs">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {currentUserRole === "OWNER" && (
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Remove</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DeleteInvitationDialog />
    </>
  );
}

export function ProjectMemberSkeleton() {
  return <div>loading</div>;
}
