"use client";

import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "~/lib/utils";
import { EditorMenuBar } from "./editor-menu-bar";
import { ColorHighlighter } from "./extensions/color-highlighter";
import { ImageExtension } from "./extensions/image";
import { SmilieReplacer } from "./extensions/smile-replacer";
import { VideoExtension } from "./extensions/video";

type Props = {
  userId: string;
  projectId: string;
  postId: string;
  value: string;
  onChange(value: string): void;
};

export const ForceTitle = Document.extend({
  content: "heading block*",
});

export function Tiptap({ userId, projectId, postId, value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      ForceTitle,
      StarterKit.configure({
        document: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "What's the title?";
          }

          return "";
        },
      }),
      Typography,
      ColorHighlighter,
      SmilieReplacer,
      ImageExtension(userId, projectId, postId),
      VideoExtension(userId, projectId, postId),
    ],
    editorProps: {
      attributes: {
        class: cn(
          // input styles
          "rounded-md border border-input px-3 py-4 bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
