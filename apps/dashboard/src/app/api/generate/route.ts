import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { isUserPro } from "@acme/common/external/stripe/actions";
import { db, eq, users } from "@acme/db";

import { env } from "~/env.mjs";
import { $getUser } from "~/lib/shared/get-user";
import { AiGenerateSchema } from "~/lib/validation/schema";

const config = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// until we next-auth supports it, we cannot use edge
// export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  if (env.NODE_ENV !== "development") {
    const user = await $getUser();

    const dbUser = await db
      .select({
        stripeSubscriptionId: users.stripeSubscriptionId,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .then((x) => x[0]!);

    if (!dbUser) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const isPro = await isUserPro(dbUser.stripeSubscriptionId);

    if (!isPro) {
      return new Response("Forbidden", {
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

  // remove line breaks,
  // remove trailing slash
  // limit to 5000 characters
  const promptCleaned = prompt
    .replace(/\n/g, " ")
    .replace(/\/$/, "")
    .slice(0, 5000);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that continues existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones. Make sure to construct complete sentences. " +
          "If you need to separate paragraphs, you should use a <p> tag and not a line break.",
      },
      { role: "user", content: promptCleaned },
    ],
    max_tokens: env.NODE_ENV === "development" ? 5 : 200,
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
