import { headers } from "next/headers";
import { Receiver } from "@upstash/qstash/nodejs";

import { NotificationType, prisma } from "@acme/db";
import { type AppNotification } from "@acme/notifications";

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

  const { id, type, data } = JSON.parse(body) as AppNotification;

  const notificationExists = await prisma.notification.count({
    where: {
      notificationId: id,
    },
  });

  // notification has already been processed
  if (notificationExists > 0) {
    return new Response(null, {
      status: 200,
    });
  }

  try {
    let response: Response;
    //
    switch (type) {
      case NotificationType.PROJECT_INVITATION: {
        response = await handleProjectInvitationNotification(id, data);
        break;
      }
      case NotificationType.REMOVED_FROM_PROJECT: {
        response = await handleRemovedFromProjectNotification(id, data);
        break;
      }
      default: {
        response = new Response("Invalid notification type", {
          status: 400,
        });
      }
    }

    return response;
  } catch (e: unknown) {
    if (e instanceof Error) {
      return new Response(
        JSON.stringify({
          error: e.message,
        }),
        {
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        error: "Unknown error",
      }),
      {
        status: 500,
      },
    );
  }
}
