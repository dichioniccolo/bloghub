import { serve } from "inngest/next";

import { inngest } from "@acme/inngest";

import { convertPostV1TOv2 } from "./functions/convert-v1-to-v2";
import { domainVerification } from "./functions/domain-verification";
import { invitationAcceptedNotification } from "./functions/notifications/invitation.accepted";
import { projectInvitationNotification } from "./functions/notifications/project.invitation";
import { removedFromProjectNotification } from "./functions/notifications/project.user.removed";
import { postUpdate } from "./functions/post/update";
import { postUpdateSettings } from "./functions/post/update.settings";
import { projectDelete } from "./functions/project/delete";
import { projectUpdateLogo } from "./functions/project/update.logo";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const { GET, POST, PUT } = serve(inngest, [
  domainVerification,
  convertPostV1TOv2,
  projectInvitationNotification,
  invitationAcceptedNotification,
  removedFromProjectNotification,
  projectDelete,
  projectUpdateLogo,
  postUpdate,
  postUpdateSettings,
]);
