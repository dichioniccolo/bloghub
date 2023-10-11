import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { domainVerification } from "./functions/domain-verification";
import { invitationAcceptedNotification } from "./functions/notifications/invitation.accepted";
import { projectInvitationNotification } from "./functions/notifications/project.invitation";
import { removedFromProjectNotification } from "./functions/notifications/project.user.removed";
import { postUpdate } from "./functions/post/update";
import { postUpdateSettings } from "./functions/post/update.settings";
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
    postUpdate,
    postUpdateSettings,
  ],
});
