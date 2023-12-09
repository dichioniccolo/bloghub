"use client";

import type { Content } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Loader2 } from "lucide-react";

import {
  EditorExtensions,
  ResizableMedia,
  TiptapEditorProps,
} from "@acme/editor";

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
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  return <EditorContent editor={editor} />;
}
