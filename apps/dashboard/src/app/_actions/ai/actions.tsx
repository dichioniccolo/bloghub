import "server-only";

import type { ReactNode } from "react";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import OpenAI from "openai";

import { spinner } from "~/components/spinner";
import { env } from "~/env.mjs";
import { runOpenAICompletion } from "~/lib/openai";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // Update AI state with new message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: content,
    },
  ]);

  const reply = createStreamableUI(spinner);

  const completion = runOpenAICompletion(openai, {
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `\
          You are an AI writing assistant and you can help users to simplify text, fix spelling,
          make text shorter or longer, emojify text, summarize text, translate text, add tone to text and complete sentences.
          Messages insite [] means that it's a UI element or a user event. For example:
          - "I want to [simplify] this text" means that the user wants to simplify the text.
          - "I want to [fix spelling] in this text" means that the user wants to fix spelling in the text.
          - "[make text shorter]" it means that the user wants to make the text shorter.

          Beside this, you can not chat with users, you can only help them with the tasks mentioned above.
        `,
      },
      ...aiState.get().map((info) => ({
        role: info.role,
        content: info.content,
        name: info.name,
      })),
    ],
    functions: [],
    temperature: 0,
  });

  completion.onTextContent((content, isFinal) => {
    reply.update(<>{content}</>);

    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  return {
    id: Date.now(),
    display: reply.value,
  };
}

// Define necessary types and create the AI.

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});
