import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { Role } from "@acme/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui";

import { PlaceholderWithIllustration } from "~/app/_components/placeholder-with-image";
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
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const project = await getProject(id);

  return {
    title: `${project?.name} members`,
  };
}

export default async function AppDashboardProjectSettingsMembersPage({
  params: { id },
}: Props) {
  const project = await getProject(id);

  if (!project) return notFound();

  const [roleOfUser, users, invites] = await Promise.all([
    getProjectUserRole(id),
    getProjectUsers(id),
    getProjectInvites(id),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Members</CardTitle>
        <CardDescription>
          Team mates or friends that have access to this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] space-y-4">
        {roleOfUser === Role.OWNER && <InviteMemberDialog projectId={id} />}
        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="space-y-2 divide-y">
            {users.map((user) => (
              <ProjectMember
                key={user.id}
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
                createdAt={invite.createdAt}
                user={{
                  email: invite.email,
                }}
              />
            ))}
            {invites.length === 0 && (
              <PlaceholderWithIllustration
                text="There are no pending invitations."
                src="/static/illustrations/video-park.svg"
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
