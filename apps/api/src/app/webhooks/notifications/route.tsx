import { headers } from "next/headers";
import { Receiver } from "@upstash/qstash/nodejs";

import { type AppNotification } from "@acme/common/notifications";
import { NotificationType } from "@acme/db";

import { env } from "~/env.mjs";
import { handleProjectInvitationNotification } from "./handlers/project-invitation";
import { handleRemovedFromProjectNotification } from "./handlers/removed-from-project";

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Upstash-Signature") ?? "";

  const valid = await receiver.verify({
    signature,
    body,
  });

  if (!valid) {
    return new Response(null, {
      status: 401,
    });
  }

  const { type, data } = JSON.parse(body) as AppNotification;

  let response: Response;

  switch (type) {
    case NotificationType.PROJECT_INVITATION: {
      response = await handleProjectInvitationNotification(data);
      break;
    }
    case NotificationType.REMOVED_FROM_PROJECT: {
      response = await handleRemovedFromProjectNotification(data);
      break;
    }
    default: {
      response = new Response("Invalid notification type", {
        status: 400,
      });
    }
  }

  return response;
}
