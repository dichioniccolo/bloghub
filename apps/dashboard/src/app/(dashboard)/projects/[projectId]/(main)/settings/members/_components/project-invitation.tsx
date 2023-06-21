"use client";

import { formatDistance } from "date-fns";

import { Role, type RoleType } from "@acme/db/types";
import {
  Avatar,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { type GetProjectInvites } from "~/lib/shared/api/projects";
import { getDefaultAvatarImage } from "~/lib/utils";
import { useDeleteInvitationDialog } from "./delete-invitation-dialog";

type Props = {
  projectId: string;
  currentUserRole: RoleType;
  invite: GetProjectInvites[number];
};

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
            <p className="text-xs text-gray-500">
              Invited{" "}
              {formatDistance(invite.createdAt, new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xxs">
                <Icons.moreV className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {currentUserRole === Role.Owner && (
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Icons.delete className="mr-2 h-4 w-4" />
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
