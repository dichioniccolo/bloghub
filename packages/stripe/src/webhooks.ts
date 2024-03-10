"use server";

import type Stripe from "stripe";

import { prisma } from "@acme/db";

import { stripe } from ".";
import { stripePriceToSubscriptionPlan } from "./plans";

export async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (typeof session.subscription !== "string") {
        throw new Error("Missing or invalid subscription");
      }

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription,
      );

      const stripeCustomerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const { userId } = subscription.metadata;

      if (!userId) {
        throw new Error("Missing userId");
      }

      const subscriptionPlan = stripePriceToSubscriptionPlan(
        subscription.items.data[0]?.price.id,
      );

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscriptionPlan.priceId,
          dayWhenBillingStarts: new Date(),
        },
      });

      break;
    }
    case "invoice.payment_succeeded": {
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;

      const stripeCustomerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const subscriptionPlan = stripePriceToSubscriptionPlan(
        subscription.items.data[0]?.price.id,
      );

      await prisma.user.update({
        where: { stripeCustomerId },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscriptionPlan.priceId,
          dayWhenBillingStarts: new Date(),
        },
      });

      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;

      const stripeCustomerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      await prisma.user.update({
        where: { stripeCustomerId },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          dayWhenBillingStarts: new Date(),
        },
      });
      break;
    }
  }
}
