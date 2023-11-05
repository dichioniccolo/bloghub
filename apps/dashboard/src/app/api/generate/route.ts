import type { ServerRuntime } from "next";
import { Ratelimit } from "@upstash/ratelimit";
import { ipAddress } from "@vercel/edge";
import { kv } from "@vercel/kv";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { db } from "@acme/db";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { getCurrentUser } from "~/app/_api/get-user";
import { env } from "~/env.mjs";
import { AiGenerateSchema } from "~/lib/validation/schema";
import { getSystemPrompts } from "./system-prompts";

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime: ServerRuntime = "edge";

export async function POST(req: Request): Promise<Response> {
  if (env.NODE_ENV !== "development") {
    const user = await getCurrentUser();

    const dbUser = await db.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: {
        stripePriceId: true,
      },
    });

    const plan = stripePriceToSubscriptionPlan(dbUser.stripePriceId);

    if (!isSubscriptionPlanPro(plan)) {
      return new Response("You must be a pro member to use AI features", {
        status: 403,
      });
    }

    const ip = ipAddress(req) ?? "127.0.0.1";
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
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
  }

  const parsedResult = await AiGenerateSchema.safeParseAsync(await req.json());

  if (!parsedResult.success) {
    return new Response(JSON.stringify(parsedResult.error), {
      status: 422,
    });
  }

  const { prompt, type } = parsedResult.data;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: getSystemPrompts(type),
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // If the response is unauthorized, return a 500 error
  if (response.status === 401) {
    return new Response("You are unauthorized to perform this action", {
      status: 500,
    });
  }

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
