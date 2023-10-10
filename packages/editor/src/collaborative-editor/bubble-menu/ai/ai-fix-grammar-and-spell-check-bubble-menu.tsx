import type { Editor } from "@tiptap/core";

import { useBubbleMenu } from "../bubble-menu-context";
import { AiBubbleMenu } from "./ai-bubble-menu";
import { useFixGrammarAndSpellCheck } from "./use-ai-completion";

interface Props {
  editor: Editor;
  className?: string;
}

export function AiFixGrammarAndSpellCheckBubbleMenu({
  className,
  editor,
}: Props) {
  const { isFixGrammarAndSpellCheckOpen, setIsFixGrammarAndSpellCheckOpen } =
    useBubbleMenu();

  const completionOptions = useFixGrammarAndSpellCheck();

  return (
    <AiBubbleMenu
      editor={editor}
      open={isFixGrammarAndSpellCheckOpen}
      setOpen={setIsFixGrammarAndSpellCheckOpen}
      className={className}
      completionOptions={completionOptions}
    />
  );
}
