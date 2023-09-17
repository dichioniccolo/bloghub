import type { UseCompletionOptions } from "ai";
import { useCompletion } from "ai/react";
import { toast } from "sonner";

type CompletionOptions = Omit<UseCompletionOptions, "api">;

function useAppCompletion(options: CompletionOptions) {
  return useCompletion({
    api: "/api/generate",
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
}

type CompletionOptionsWithoutIdentifiers = Omit<
  CompletionOptions,
  "id" | "body"
>;

export function useAiCompletion(options?: CompletionOptionsWithoutIdentifiers) {
  return useAppCompletion({
    id: "completion",
    body: {
      type: "completion",
    },
    ...(options ?? {}),
  });
}

export function useFixGrammarAndSpellCheck(
  options?: CompletionOptionsWithoutIdentifiers,
) {
  return useAppCompletion({
    id: "fix_grammar_spelling",
    body: {
      type: "fix_grammar_spelling",
    },
    ...(options ?? {}),
  });
}

export function useSummarizeCompletion(
  options?: CompletionOptionsWithoutIdentifiers,
) {
  return useAppCompletion({
    id: "summarize",
    body: {
      type: "summarize",
    },
    ...(options ?? {}),
  });
}
