import type { ServerRuntime } from "next";
import { ipAddress } from "@vercel/edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

import { db, eq, schema } from "@acme/db";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { getCurrentUser } from "~/app/_api/get-user";
import { env } from "~/env.mjs";
import { ratelimitAi } from "~/lib/ratelimit";
import { AiGenerateSchema } from "~/lib/validation/schema";
import { getFunctions, getSystemPrompts } from "./system-prompts";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const runtime: ServerRuntime = "edge";

export async function POST(req: Request): Promise<Response> {
  if (env.NODE_ENV !== "development") {
    const ip = ipAddress(req) ?? "127.0.0.1";

    const { success, limit, reset, remaining } = await ratelimitAi.limit(
      `${ip}-ai`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }

    const user = await getCurrentUser();

    const dbUser = await db.query.users.findFirst({
      where: eq(schema.users.id, user.id),
      columns: {
        stripePriceId: true,
      },
    });

    if (!dbUser) {
      return new Response("You must be a pro member to use AI features", {
        status: 403,
      });
    }

    const plan = stripePriceToSubscriptionPlan(dbUser.stripePriceId);

    if (!isSubscriptionPlanPro(plan)) {
      return new Response("You must be a pro member to use AI features", {
        status: 403,
      });
    }
  }

  const parsedResult = await AiGenerateSchema.safeParseAsync(await req.json());

  if (!parsedResult.success) {
    return new Response(JSON.stringify(parsedResult.error), {
      status: 422,
    });
  }

  const { prompt, type } = parsedResult.data;

  const response = await openai.chat.completions.create({
    stream: true,
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: getSystemPrompts(type),
      },
      { role: "user", content: prompt },
    ],
    functions: getFunctions(type),
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
