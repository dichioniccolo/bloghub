import Stripe from "stripe";

import { env } from "./env";

export type { Stripe };

export const stripe = new Stripe(env.STRIPE_API_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});
