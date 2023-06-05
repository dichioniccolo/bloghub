"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "~/lib/utils";
import { EditorMenuBar } from "./editor-menu-bar";
import { createImageExtension } from "./extensions/image";
import { createVideoExtension } from "./extensions/video";

type Props = {
  userId: string;
  projectId: string;
  postId: string;
  value: string;
  onChange(value: string): void;
};

export function Tiptap({ userId, projectId, postId, value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      createImageExtension(userId, projectId, postId),
      createVideoExtension(userId, projectId, postId),
    ],
    editorProps: {
      attributes: {
        class: cn(
          // input styles
          "rounded-md border border-input px-3 py-2 bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "prose prose-md max-w-none sm:prose-lg min-h-[500px] dark:prose-invert",
        ),
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="space-y-2 pb-16">
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
