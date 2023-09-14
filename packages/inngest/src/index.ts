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
  "post/update": WrapWithData<{ id: string }>;
  "post/update.settings": WrapWithData<{
    projectId: string;
    postId: string;
    oldThumbnailUrl?: string | null;
    newThumbnailUrl?: string | null;
  }>;
};

export const inngest = new Inngest({
  name: "BlogHub",
  schemas: new EventSchemas().fromRecord<InngestEvents>(),
});
