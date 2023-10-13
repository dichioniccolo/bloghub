import { EventSchemas, Inngest } from "inngest";

import type {
  InvitationAcceptedNotificationData,
  ProjectInvitationNotificationData,
  RemovedFromProjectNotificationData,
} from "@acme/notifications";

interface WrapWithData<T> {
  data: T;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type InngestEvents = {
  "notification/project.invitation": WrapWithData<ProjectInvitationNotificationData>;
  "notification/invitation.accepted": WrapWithData<InvitationAcceptedNotificationData>;
  "notification/project.user.removed": WrapWithData<RemovedFromProjectNotificationData>;
  "project/delete": WrapWithData<{ id: string; domain: string }>;
  "project/update.logo": WrapWithData<{
    projectId: string;
    oldLogoUrl?: string | null;
    newLogoUrl?: string | null;
  }>;
  "post/create": WrapWithData<{ postId: string; projectId: string }>;
  "post/delete": WrapWithData<{ postId: string; projectId: string }>;
  "media/delete.unused": WrapWithData<never>;
};

export const inngest = new Inngest({
  id: "BlogHub",
  schemas: new EventSchemas().fromRecord<InngestEvents>(),
});
