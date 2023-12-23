import type { Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough } from "lucide-react";

import { Button } from "@acme/ui/components/ui/button";

interface Props {
  editor: Editor;
}

export function ToolbarInline({ editor }: Props) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleBold().run()}
        disabled={!editor.can().chain().toggleBold().run()}
      >
        <Bold className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleItalic().run()}
        disabled={!editor.can().chain().toggleItalic().run()}
      >
        <Italic className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleStrike().run()}
        disabled={!editor.can().chain().toggleStrike().run()}
      >
        <Strikethrough className="h-5 w-5" />
      </Button>
    </>
  );
}
