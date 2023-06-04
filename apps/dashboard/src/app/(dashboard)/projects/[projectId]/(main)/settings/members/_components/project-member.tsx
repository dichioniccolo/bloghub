"use client";

import { formatDistance } from "date-fns";

import { type Role } from "@acme/db";
import {
  Avatar,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { type GetProjectUsers } from "~/lib/shared/api/projects";
import { getDefaultAvatarImage } from "~/lib/utils";
import { useDeleteMemberDialog } from "./delete-member-dialog";

type Props = {
  projectId: string;
  currentUserRole: Role;
  member: GetProjectUsers[number];
};

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
                <p className="text-xs text-gray-500">{member.user.email}</p>
              </>
            ) : (
              <h3 className="text-sm font-medium">{member.user.email}</h3>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">{member.role}</p>
            <p className="text-xs text-gray-500">
              Joined{" "}
              {formatDistance(member.createdAt, new Date(), {
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
                {currentUserRole === "OWNER" && member.role !== "OWNER" && (
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
      <DeleteMemberDialog />
    </>
  );
}

export function ProjectMemberSkeleton() {
  return <div>loading</div>;
}
