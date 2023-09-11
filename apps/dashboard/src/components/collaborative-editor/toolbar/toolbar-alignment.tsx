import type { Editor } from "@tiptap/react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

import { Button } from "~/components/ui/button";

interface Props {
  editor: Editor;
}

export function ToolbarAlignment({ editor }: Props) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().setTextAlign("left").run()}
        disabled={!editor.can().chain().setTextAlign("left").run()}
      >
        <AlignLeft className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().setTextAlign("center").run()}
        disabled={!editor.can().chain().setTextAlign("center").run()}
      >
        <AlignCenter className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().setTextAlign("right").run()}
        disabled={!editor.can().chain().setTextAlign("right").run()}
      >
        <AlignRight className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().setTextAlign("justify").run()}
        disabled={!editor.can().chain().setTextAlign("justify").run()}
      >
        <AlignJustify className="h-5 w-5" />
      </Button>
    </>
  );
}
