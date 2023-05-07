import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { clerkClient } from "@clerk/nextjs";
import { Webhook } from "svix";

import { prisma } from "@acme/db";

const secret = "whsec_4NI7Sd804IpSx0xgAM6ePnWof6SRs6p3";

export const runtime = "edge";

export async function POST(request: Request) {
  const payload = await request.text();
  const webhook = new Webhook(secret);

  const headers = {
    "svix-id": request.headers.get("svix-id") || "",
    "svix-signature": request.headers.get("svix-signature") || "",
    "svix-timestamp": request.headers.get("svix-timestamp") || "",
  };

  try {
    const body = webhook.verify(payload, headers);

    const event = body as WebhookEvent;

    if (event.type === "user.created") {
      const user = event.data;

      const dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
        },
        select: {
          id: true,
        },
      });

      await clerkClient.users.updateUser(user.id, {
        externalId: dbUser.id,
      });
    } else if (event.type === "user.updated") {
      // const user = event.data;
      // await prisma.user.update({
      //   where: {
      //     clerkId: user.id,
      //   },
      //   data: {},
      // });
    }
  } catch (e: unknown) {
    const error = e as Error;

    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }

  return new Response(null, { status: 200 });
}
