import { OpenAIStream } from "ai";
import type OpenAI from "openai";
import zodToJsonSchema from "zod-to-json-schema";

import type { ToolDefinition } from "./tool-definition";

const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done } = await reader.read();
    if (done) {
      break;
    }
  }
};

export function runOpenAICompletion<
  T extends Omit<
    Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
    "functions"
  > & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functions: ToolDefinition<any, any>[];
  },
>(openai: OpenAI, params: T) {
  let text = "";
  let hasFunction = false;

  type FunctionNames = T["functions"] extends unknown[]
    ? T["functions"][number]["name"]
    : never;

  let onTextContent: (
    text: string,
    isFinal: boolean,
  ) => void | Promise<void> = () => {
    //
  };
  const onFunctionCall: Record<
    string,
    (args: Record<string, unknown>) => void | Promise<void>
  > = {};

  const { functions, ...rest } = params;

  void (async () => {
    void consumeStream(
      OpenAIStream(
        await openai.chat.completions.create({
          ...rest,
          stream: true,
          functions: functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters) as Record<
              string,
              unknown
            >,
          })),
        }),
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;
            onFunctionCall[functionCallPayload.name]?.(
              functionCallPayload.arguments,
            );
          },
          onToken(token) {
            text += token;
            if (text.startsWith("{")) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        },
      ),
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>,
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: (
      name: FunctionNames,
      callback: (args: unknown) => void | Promise<void>,
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}
