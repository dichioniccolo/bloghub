import { EventSchemas, Inngest } from "inngest";

import type {
  InvitationAcceptedNotificationData,
  ProjectInvitationNotificationData,
  RemovedFromProjectNotificationData,
} from "~/lib/notifications";

type WrapWithData<T> = {
  data: T;
};

export type InngestEvents = {
  "notification/project.invitation": WrapWithData<ProjectInvitationNotificationData>;
  "notification/invitation.accepted": WrapWithData<InvitationAcceptedNotificationData>;
  "notification/project.user.removed": WrapWithData<RemovedFromProjectNotificationData>;
  "project/delete": WrapWithData<{ id: string; domain: string }>;
};

export const inngest = new Inngest({
  name: "BlogHub",
  schemas: new EventSchemas().fromRecord<InngestEvents>(),
});
