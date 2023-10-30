import type { Editor } from "@tiptap/react";
import { Redo, Undo } from "lucide-react";

import { Button } from "@acme/ui/components/button";

interface Props {
  editor: Editor;
}

export function ToolbarCommands({ editor }: Props) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().undo().run()}
        disabled={!editor.can().chain().undo().run()}
      >
        <Undo className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().redo().run()}
        disabled={!editor.can().chain().redo().run()}
      >
        <Redo className="h-5 w-5" />
      </Button>
    </>
  );
}
