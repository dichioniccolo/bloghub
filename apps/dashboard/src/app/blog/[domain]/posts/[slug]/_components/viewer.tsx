"use client";

import type { JSONContent } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";
import { Loader2 } from "lucide-react";

import { useEditor } from "~/hooks/use-editor";
import { TiptapExtensions } from "~/lib/editor";

type Props = {
  value: JSONContent;
};

export function Viewer({ value }: Props) {
  const editor = useEditor({
    editable: false,
    extensions: [...TiptapExtensions],
    content: value,
  });

  if (!editor) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[500px] w-full px-0 py-12 sm:mb-[20vh]">
      <EditorContent editor={editor} />
    </div>
  );
}
