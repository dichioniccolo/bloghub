import { serve } from "inngest/next";

import { inngest } from "~/lib/inngest";
import { cleanupFunction } from "./functions/cleanup";
import { domainVerification } from "./functions/domain-verification";
import { invitationAcceptedNotification } from "./functions/notifications/invitation.accepted";
import { projectInvitationNotification } from "./functions/notifications/project.invitation";
import { removedFromProjectNotification } from "./functions/notifications/project.user.removed";
import { projectDelete } from "./functions/project/delete";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const { GET, POST, PUT } = serve(inngest, [
  projectInvitationNotification,
  invitationAcceptedNotification,
  removedFromProjectNotification,
  cleanupFunction,
  domainVerification,
  projectDelete,
]);
