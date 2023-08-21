import { headers } from "next/headers";
import { NextResponse } from "next/server";

import type { Stripe } from "@acme/stripe";
import { stripe } from "@acme/stripe";
import { handleEvent } from "@acme/stripe/webhooks";

import { env } from "~/env.mjs";

export async function POST(req: Request) {
  const payload = await req.text();

  const signature = headers().get("Stripe-Signature")!;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET,
  ) as Stripe.DiscriminatedEvent;

  try {
    await handleEvent(event);

    console.log("✅ Handled Stripe Event", event.type);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.log(
      `❌ Error when handling Stripe Event: ${event.type}, Message: ${message}`,
    );
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
