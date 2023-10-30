import type { Editor } from "@tiptap/core";

import { useBubbleMenu } from "../bubble-menu-context";
import { AiBubbleMenu } from "./ai-bubble-menu";
import { useSummarizeCompletion } from "./use-ai-completion";

interface Props {
  editor: Editor;
  className?: string;
}

export function AiSummarizeBubbleMenu({ className, editor }: Props) {
  const { isSummarizeOpen, setIsSummarizeOpen } = useBubbleMenu();

  const completionOptions = useSummarizeCompletion();

  return (
    <AiBubbleMenu
      editor={editor}
      open={isSummarizeOpen}
      setOpen={setIsSummarizeOpen}
      className={className}
      completionOptions={completionOptions}
    />
  );
}
