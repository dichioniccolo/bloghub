"use client";

import { useCallback } from "react";
import { type Editor as EditorType } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Loader2 } from "lucide-react";

import { Providers } from "./custom-extensions/providers";
import { TiptapExtensions } from "./extensions";
import { TiptapEditorProps } from "./props";

type Props = {
  status?: "saved" | "unsaved" | "saving";
  setStatus?(status: "saved" | "unsaved" | "saving"): void;
  userId?: string;
  projectId?: string;
  postId?: string;
  value: string;
  onChange?(value: string): void;
  editable?: boolean;
};

export function Editor({
  status,
  setStatus,
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

  const onUpdate = useCallback(
    ({ editor }: { editor: EditorType }) => {
      setStatus?.("unsaved");
      onChange?.(editor.getHTML());
    },
    [onChange, setStatus],
  );

  const editor = useEditor({
    extensions: TiptapExtensions(userId, projectId, postId),
    editorProps: {
      ...TiptapEditorProps,
      // attributes: {
      //   class: cn(
      //     // input styles
      //     editable &&
      //       "editor rounded-md py-4 bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
      //     "prose prose-md max-w-none sm:prose-lg min-h-[500px] dark:prose-invert px-1",
      //   ),
      // },
    },
    editable,
    content: value,
    onUpdate,
    autofocus: "end",
  });

  // useEffect(() => {
  //   // if user presses escape or cmd + z and it's loading,
  //   // stop the request, delete the completion, and insert back the "++"
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
  //       stop();
  //       if (e.key === "Escape") {
  //         editor?.commands.deleteRange({
  //           from: editor.state.selection.from - completion.length,
  //           to: editor.state.selection.from,
  //         });
  //       }
  //       editor?.commands.insertContent("++");
  //     }
  //   };
  //   if (isLoading) {
  //     document.addEventListener("keydown", onKeyDown);
  //   }
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown);
  //   };
  // }, [stop, isLoading, editor, completion.length]);

  // const prev = useRef("");

  // useEffect(() => {
  //   const diff = completion.slice(prev.current.length);
  //   prev.current = completion;
  //   editor?.commands.insertContent(diff);
  // }, [isLoading, editor, completion]);

  if (!editor) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Providers
      editor={editor}
      editable={editable}
      userId={userId}
      projectId={projectId}
      postId={postId}
    >
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="relative min-h-[500px] w-full px-0 py-12 sm:mb-[20vh]"
      >
        {editable && status && (
          <div className="absolute right-5 top-5 mb-5 rounded-lg bg-stone-100 px-2 py-1 text-sm text-stone-400">
            {status === "unsaved"
              ? "Unsaved"
              : status === "saving"
              ? "Saving..."
              : "Saved"}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </Providers>
  );
}
