import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { domainVerification } from "./functions/domain-verification";
import { invitationAcceptedNotification } from "./functions/notifications/invitation.accepted";
import { projectInvitationNotification } from "./functions/notifications/project.invitation";
import { removedFromProjectNotification } from "./functions/notifications/project.user.removed";
import { projectDelete } from "./functions/project/delete";
import { projectUpdateLogo } from "./functions/project/update.logo";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    domainVerification,
    // convertPostV1TOv2,
    projectInvitationNotification,
    invitationAcceptedNotification,
    removedFromProjectNotification,
    projectDelete,
    projectUpdateLogo,
    // mediaDeleteUnused,
  ],
});
