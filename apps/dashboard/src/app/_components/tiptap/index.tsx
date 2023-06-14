"use client";

import Focus from "@tiptap/extension-focus";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "~/lib/utils";
import { Icons } from "../icons";
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

export function Tiptap({ userId, projectId, postId, value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Focus,
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
          "editor rounded-md py-4 bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          "prose prose-md max-w-none sm:prose-lg min-h-[500px] dark:prose-invert",
        ),
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto pb-16">
      <EditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
