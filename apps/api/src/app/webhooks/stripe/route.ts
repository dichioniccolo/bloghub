import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe, type Stripe } from "@bloghub/common/external/stripe";
import { getUserSubscription } from "@bloghub/common/external/stripe/actions";
import { db, eq, users } from "@bloghub/db";

import { env } from "~/env.mjs";

const relevantEvents = new Set([
  "checkout.session.completed",
  "invoice.payment_succeeded",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  if (!signature) {
    return new Response("Webhook Error: Missing signature", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  if (!relevantEvents.has(event.type)) {
    return new Response(`🤷 Unhandled event type: ${event.type}`, {
      status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.client_reference_id) {
        return new Response("Webhook Error: Unable to identify the user", {
          status: 400,
        });
      }

      const subscription =
        typeof session.subscription === "string"
          ? await getUserSubscription(session.subscription)
          : session.subscription;

      if (!subscription) {
        return new Response(
          "Webhook Error: Unable to identify the subscription",
          {
            status: 400,
          },
        );
      }

      // Update the user stripe into our database.
      // Since this is the initial subscription, we need to update
      // the subscription id and customer id.
      await db
        .update(users)
        .set({
          stripeCustomerId: subscription.customer.toString(),
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
          dayWhenBillingStarts: new Date(),
        })
        .where(eq(users.id, session.client_reference_id));
    } else if (event.type === "invoice.payment_succeeded") {
      //
    } else if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(users)
        .set({
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
          dayWhenBillingStarts: new Date(),
        })
        .where(eq(users.stripeCustomerId, subscription.customer.toString()));
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(users)
        .set({
          stripeSubscriptionId: null,
          stripePriceId: null,
          dayWhenBillingStarts: new Date(),
        })
        .where(eq(users.stripeCustomerId, subscription.customer.toString()));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return new Response(`Webhook Error: Unhandled ${e.message}`, {
      status: 500,
    });
  }

  return NextResponse.json({
    received: true,
  });
}
