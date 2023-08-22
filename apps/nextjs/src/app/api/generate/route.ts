import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { db, eq, users } from "@acme/db";
import {
  isSubscriptionPlanPro,
  stripePriceToSubscriptionPlan,
} from "@acme/stripe/plans";

import { $getUser } from "~/app/_api/get-user";
import { env } from "~/env.mjs";
import { AiGenerateSchema } from "~/lib/validation/schema";

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// until we next-auth supports it, we cannot use edge
// export const runtime: ServerRuntime = "edge";

export async function POST(req: Request): Promise<Response> {
  if (env.NODE_ENV !== "development") {
    const user = await $getUser();

    const dbUser = await db
      .select({
        stripePriceId: users.stripePriceId,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .then((x) => x[0]!);

    if (!dbUser) {
      return new Response("You are unauthorized to perform this action", {
        status: 401,
      });
    }

    const plan = stripePriceToSubscriptionPlan(dbUser.stripePriceId);

    if (!isSubscriptionPlanPro(plan)) {
      return new Response("You must be a pro member to use AI features", {
        status: 403,
      });
    }

    const ip = req.headers.get("x-forwarded-for");
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

  const { prompt } = parsedResult.data;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. " +
          "Limit your response to no more than 200 characters, but make sure to construct complete sentences.",
        // we're disabling markdown for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
        // "Use Markdown formatting when appropriate.",
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