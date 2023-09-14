"use client";

import type { Content } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Loader2 } from "lucide-react";

import { EditorExtensions } from "~/components/collaborative-editor/extensions";
import { ResizableMedia } from "~/components/collaborative-editor/resizable-media";
import { TiptapEditorProps } from "~/lib/editor/props";

interface Props {
  value: Content;
}

export function Viewer({ value }: Props) {
  const editor = useEditor({
    editable: false,
    editorProps: TiptapEditorProps,
    extensions: [
      ...EditorExtensions({
        openLinkOnClick: true,
      }),
      ResizableMedia,
    ],
    content: value,
  });

  if (!editor) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full px-0 py-12">
      <EditorContent editor={editor} />
    </div>
  );
}
