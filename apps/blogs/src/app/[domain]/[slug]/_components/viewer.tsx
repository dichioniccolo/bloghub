"use client";

import type { Content } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import { Loader2 } from "lucide-react";

import { useBlockEditor } from "@acme/editor";

interface Props {
  value: Content;
}

export function Viewer({ value }: Props) {
  const { editor } = useBlockEditor({
    initialContent: value,
    editable: false,
    onUpload: () => Promise.resolve(""),
  });

  if (!editor) {
    return <Loader2 className="nimate-spin size-6" />;
  }

  return <EditorContent editor={editor} />;
}
