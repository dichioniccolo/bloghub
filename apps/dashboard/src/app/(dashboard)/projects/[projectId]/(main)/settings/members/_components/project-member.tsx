"use client";

import { formatDistance } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";

import type { Role } from "@acme/db";
import { getDefaultAvatarImage } from "@acme/lib/utils";
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
  DropdownMenuTrigger,
} from "@acme/ui/components/ui/dropdown-menu";
import { Skeleton } from "@acme/ui/components/ui/skeleton";

import type { GetProjectUsers } from "~/app/_api/projects";
import { useDeleteMemberDialog } from "./delete-member-dialog";

interface Props {
  projectId: string;
  currentUserRole: Role;
  member: GetProjectUsers[number];
}

export function ProjectMember({ projectId, currentUserRole, member }: Props) {
  const { setOpen, DeleteMemberDialog } = useDeleteMemberDialog(projectId, {
    id: member.user.id,
    name: member.user.name,
    email: member.user.email,
  });

  return (
    <>
      <div className="flex items-center justify-between space-x-3 py-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              alt={member.user.name ?? member.user.email ?? "User"}
              src={getDefaultAvatarImage(member.user.email ?? "")}
            />
          </Avatar>
          <div className="flex flex-col">
            {member.user.name ? (
              <>
                <h3 className="text-sm font-medium">{member.user.name}</h3>
                <p className="text-xs text-stone-500">{member.user.email}</p>
              </>
            ) : (
              <h3 className="text-sm font-medium">{member.user.email}</h3>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex flex-col">
            <p className="text-sm text-stone-500">{member.role}</p>
            <p className="text-xs text-stone-500">
              Joined{" "}
              {formatDistance(member.createdAt, new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
          {currentUserRole === "OWNER" && member.role !== "OWNER" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xxs">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Remove</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <DeleteMemberDialog />
    </>
  );
}

export function ProjectMemberPlaceholder() {
  return (
    <div className="flex items-center justify-between space-x-3 py-2">
      <div className="flex items-center space-x-3">
        <Skeleton className="rounded-full">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Skeleton>
        <div className="flex flex-col">
          <Skeleton className="w-40">&nbsp;</Skeleton>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <div className="flex flex-col">
          <Skeleton className="w-40">&nbsp;</Skeleton>
        </div>
        <Skeleton>
          <Button disabled variant="ghost" size="xxs">
            &nbsp;
          </Button>
        </Skeleton>
      </div>
    </div>
  );
}
