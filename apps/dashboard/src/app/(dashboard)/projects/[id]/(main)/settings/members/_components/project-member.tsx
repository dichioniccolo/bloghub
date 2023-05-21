import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@acme/ui";

import { getDefaultAvatarImage, timeAgo } from "~/lib/utils";

type Props = {
  role?: string;
  createdAt: string | Date;
  user: {
    name?: string | null;
    email?: string | null;
  };
};

export function ProjectMember({ role, createdAt, user }: Props) {
  return (
    <div className="flex items-center justify-between space-x-3">
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
      <div className="flex w-24 flex-col">
        <p className="text-sm text-gray-500">{role}</p>
        <p className="text-xs text-gray-500">Joined {timeAgo(createdAt)}</p>
      </div>
    </div>
  );
}

export function ProjectMemberSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-3">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarFallback />
        </Avatar>
        <div className="flex flex-col">
          <Skeleton />
        </div>
      </div>
      <div className="flex w-24 flex-col">
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  );
}
