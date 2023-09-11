/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Editor } from "@tiptap/react";

interface Props {
  editor: Editor;
}

export function WordCount({ editor }: Props) {
  return (
    <div className="px-2 py-4 text-xs text-muted-foreground">
      {editor.storage.characterCount.words()} words,{" "}
      {editor.storage.characterCount.characters()} characters
    </div>
  );
}
