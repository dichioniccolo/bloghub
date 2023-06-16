"use client";

import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2 } from "lucide-react";

import { ColorHighlighter } from "./extensions/color-highlighter";
import { SlashCommands } from "./extensions/commands";
import { ImageExtension } from "./extensions/media/image";
import { VideoExtension } from "./extensions/media/video";
import { SmilieReplacer } from "./extensions/smile-replacer";
import { cn } from "./lib/utils";

type Props = {
  userId?: string;
  projectId?: string;
  postId?: string;
  value: string;
  onChange?(value: string): void;
  editable?: boolean;
};

export function Editor({
  userId,
  projectId,
  postId,
  value,
  onChange,
  editable = true,
}: Props) {
  if (editable && (!userId || !projectId || !postId || !onChange)) {
    throw new Error("Editor is editable but missing userId, projectId, postId");
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Focus,
      Typography,
      ColorHighlighter,
      SmilieReplacer,
      Placeholder.configure({ placeholder: 'Type "/" for commands' }),
      SlashCommands,
      ImageExtension(userId, projectId, postId),
      VideoExtension(userId, projectId, postId),
    ],
    editorProps: {
      attributes: {
        class: cn(
          // input styles
          editable &&
            "editor rounded-md py-4 bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          "prose prose-md max-w-none sm:prose-lg min-h-[500px] dark:prose-invert",
        ),
      },
    },
    editable,
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto pb-16">
      {/* <EditorMenuBar editor={editor} /> */}
      <EditorContent editor={editor} />
    </div>
  );
}
