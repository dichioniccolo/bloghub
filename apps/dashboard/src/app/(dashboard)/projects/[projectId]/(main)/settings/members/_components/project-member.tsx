import { formatDistance } from "date-fns";

import { type Role } from "@acme/db";
import { Avatar, AvatarImage } from "@acme/ui";

import { getDefaultAvatarImage } from "~/lib/utils";
import { DeleteMemberDialog } from "./delete-member-dialog";

type Props = {
  projectId: string;
  currentUserRole: Role;
  role?: Role;
  createdAt: Date;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
};

export function ProjectMember({
  projectId,
  currentUserRole,
  role,
  createdAt,
  user,
}: Props) {
  return (
    <div className="flex items-center justify-between space-x-3 py-2">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage
            alt={user.name ?? user.email ?? "User"}
            src={getDefaultAvatarImage(user.email ?? "")}
          />
        </Avatar>
        <div className="flex flex-col">
          {user.name ? (
            <>
              <h3 className="text-sm font-medium">{user.name}</h3>
              <p className="text-xs text-gray-500">{user.email}</p>
            </>
          ) : (
            <h3 className="text-sm font-medium">{user.email}</h3>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <div className="flex w-24 flex-col">
          <p className="text-sm text-gray-500">{role}</p>
          <p className="text-xs text-gray-500">
            Joined {formatDistance(createdAt, new Date(), { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center justify-center">
          {currentUserRole === "OWNER" && user?.id && role !== "OWNER" && (
            <DeleteMemberDialog
              projectId={projectId}
              userToDelete={{
                id: user.id,
                name: user.name,
                email: user.email,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectMemberSkeleton() {
  return <div>loading</div>;
}
