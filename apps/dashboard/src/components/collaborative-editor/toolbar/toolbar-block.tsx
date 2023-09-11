import type { Editor } from "@tiptap/react";
import { CheckSquare, List, ListOrdered, Quote } from "lucide-react";

import { Button } from "~/components/ui/button";

interface Props {
  editor: Editor;
}

export function ToolbarBlock({ editor }: Props) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleBulletList().run()}
        disabled={!editor.can().chain().toggleBulletList().run()}
      >
        <List className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleOrderedList().run()}
        disabled={!editor.can().chain().toggleOrderedList().run()}
      >
        <ListOrdered className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleBlockquote().run()}
        disabled={!editor.can().chain().toggleBlockquote().run()}
      >
        <Quote className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleTaskList().run()}
        disabled={!editor.can().chain().toggleTaskList().run()}
      >
        <CheckSquare className="h-5 w-5" />
      </Button>
    </>
  );
}
