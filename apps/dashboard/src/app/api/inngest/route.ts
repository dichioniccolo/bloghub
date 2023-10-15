import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { domainVerification } from "./functions/domain-verification";
import { invitationAcceptedNotification } from "./functions/notifications/invitation.accepted";
import { projectInvitationNotification } from "./functions/notifications/project.invitation";
import { removedFromProjectNotification } from "./functions/notifications/project.user.removed";
import { projectDelete } from "./functions/project/delete";
import { userLoginLink } from "./functions/user/login-link";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    userLoginLink,
    domainVerification,
    projectInvitationNotification,
    invitationAcceptedNotification,
    removedFromProjectNotification,
    projectDelete,
    // mediaDeleteUnused,
  ],
});
