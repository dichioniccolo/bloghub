import { Button } from "@acme/ui/components/ui/button";
import { Separator } from "@acme/ui/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui/components/ui/tabs";

import { ProjectInvitationPlaceholder } from "./_components/project-invitation";
import { ProjectMemberPlaceholder } from "./_components/project-member";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Project Members</h2>
          <p className="text-sm text-muted-foreground">
            Team mates or friends that have access to this project.
          </p>
        </div>
        <Button disabled>Invite</Button>
      </div>
      <Separator />
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="space-y-2 divide-y">
          <ProjectMemberPlaceholder />
        </TabsContent>
        <TabsContent value="invitations" className="space-y-2 divide-y">
          <ProjectInvitationPlaceholder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
