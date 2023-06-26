import { headers } from "next/headers";
import { db, eq, Notification, notifications, sql } from "@bloghub/db";
import { type AppNotification } from "@bloghub/notifications";
import { Receiver } from "@upstash/qstash/nodejs";

import { env } from "~/env.mjs";
import { handleProjectInvitationNotification } from "./handlers/project-invitation-handler";
import { handleRemovedFromProjectNotification } from "./handlers/removed-from-project-handler";

const receiver = new Receiver({
  currentSigningKey: env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: env.QSTASH_NEXT_SIGNING_KEY,
});

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Upstash-Signature") ?? "";

  try {
    const valid = await receiver.verify({
      signature,
      body,
    });

    if (!valid) {
      return new Response(null, {
        status: 401,
      });
    }
  } catch (e) {
    return new Response(JSON.stringify(e), {
      status: 401,
    });
  }

  const { id, type, data } = JSON.parse(body) as AppNotification;

  const notificationAlreadyExists = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(notifications)
    .where(eq(notifications.id, id))
    .then((x) => x[0]!);

  // notification has already been processed
  if (notificationAlreadyExists.count > 0) {
    return new Response(null, {
      status: 200,
    });
  }

  try {
    let response: Response;
    switch (type) {
      case Notification.ProjectInvitation: {
        response = await handleProjectInvitationNotification(id, data);
        break;
      }
      case Notification.RemovedFromProject: {
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
