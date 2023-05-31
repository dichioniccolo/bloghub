import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { Role } from "@acme/db";
import { Separator, Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui";

import {
  getProject,
  getProjectInvites,
  getProjectUserRole,
  getProjectUsers,
} from "~/lib/shared/api/projects";
import { InviteMemberDialog } from "./_components/invite-member-dialog";
import { ProjectMember } from "./_components/project-member";

type Props = {
  params: {
    projectId: string;
  };
};

export async function generateMetadata({
  params: { projectId },
}: Props): Promise<Metadata> {
  const project = await getProject(projectId);

  return {
    title: `${project?.name} members`,
  };
}

export default async function AppDashboardProjectSettingsMembersPage({
  params: { projectId },
}: Props) {
  const project = await getProject(projectId);

  if (!project) return notFound();

  const [roleOfUser, users, invites] = await Promise.all([
    getProjectUserRole(projectId),
    getProjectUsers(projectId),
    getProjectInvites(projectId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Project Members</h2>
          <p className="text-sm text-muted-foreground">
            Team mates or friends that have access to this project.{" "}
          </p>
        </div>
        {roleOfUser === Role.OWNER && (
          <InviteMemberDialog projectId={projectId} />
        )}
      </div>
      <Separator />
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="space-y-2 divide-y">
          {users.map((user) => (
            <ProjectMember
              key={user.id}
              projectId={project.id}
              currentUserRole={roleOfUser}
              role={user.role}
              createdAt={user.createdAt}
              user={user.user}
            />
          ))}
        </TabsContent>
        <TabsContent value="invitations" className="space-y-2 divide-y">
          {invites.map((invite) => (
            <ProjectMember
              key={invite.id}
              projectId={project.id}
              currentUserRole={roleOfUser}
              createdAt={invite.createdAt}
              user={{
                email: invite.email,
              }}
            />
          ))}
          {invites.length === 0 && (
            <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">
                  No invitations sent
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  There are no invitations sent.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
