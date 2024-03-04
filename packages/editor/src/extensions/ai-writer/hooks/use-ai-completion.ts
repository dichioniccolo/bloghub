import type { UseCompletionOptions } from "ai";
import { useCompletion } from "ai/react";
import { toast } from "sonner";

type CompletionOptions = Omit<UseCompletionOptions, "api">;

export function useEditorCompletion(options?: CompletionOptions) {
  return useCompletion({
    api: "/api/generate",
    onError: (error) => {
      toast.error(error.message);
    },
    ...options,
  });
}
