import { serve } from "inngest/next";

import { inngest } from "~/lib/inngest";
import { cleanupFunction } from "./functions/cleanup";
import { invitationAcceptedNotification } from "./functions/notifications/invitation.accepted";
import { projectInvitationNotification } from "./functions/notifications/project.invitation";
import { removedFromProjectNotification } from "./functions/notifications/project.user.removed";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const { GET, POST, PUT } = serve(inngest, [
  projectInvitationNotification,
  invitationAcceptedNotification,
  removedFromProjectNotification,
  cleanupFunction,
]);
