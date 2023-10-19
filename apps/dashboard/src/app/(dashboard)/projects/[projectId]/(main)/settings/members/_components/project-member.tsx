"use client";

import { formatDistance } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";

import type { RoleType } from "@acme/db";
import { getDefaultAvatarImage } from "@acme/lib/utils";
import { Avatar, AvatarImage } from "@acme/ui/components/avatar";
import { Button } from "@acme/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";

import type { GetProjectUsers } from "~/app/_api/projects";
import { useDeleteMemberDialog } from "./delete-member-dialog";

interface Props {
  projectId: string;
  currentUserRole: RoleType;
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
          {currentUserRole === "owner" && member.role !== "owner" && (
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

export function ProjectMemberSkeleton() {
  return <div>loading</div>;
}
