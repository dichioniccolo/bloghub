import { useCallback, useEffect, useRef } from "react";
import type { Editor as EditorType, JSONContent } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";
import { useCompletion } from "ai/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { MediaEnumType } from "@bloghub/db";

import { createProjectMedia } from "~/app/_actions/project/create-project-media";
import { useEditor } from "~/hooks/use-editor";
import { TiptapExtensions } from "~/lib/editor";
import { ResizableMediaWithUploader } from "~/lib/editor/extensions/resizable-media";
import { EditorBubbleMenu } from "./bubble-menu";
import { AIBubbleMenu } from "./bubble-menu/ai";
import { TableMenu } from "./table-menu";

function determineMediaType(file: File): MediaEnumType | null {
  if (/image/i.test(file.type)) {
    return 1;
  }

  if (/video/i.test(file.type)) {
    return 2;
  }

  if (/audio/i.test(file.type)) {
    return 3;
  }

  return null;
}

type Props = {
  setStatus?(status: "saved" | "unsaved" | "saving"): void;
  value: string;
  onChange?(value: JSONContent): void;
  projectId: string;
  postId: string;
};

export function Editor({
  setStatus,
  value,
  onChange,
  projectId,
  postId,
}: Props) {
  const { complete, completion, isLoading, stop } = useCompletion({
    id: "editor",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      } else if (response.status === 403) {
        toast.error("You are not allowed to use ai until you upgrade to pro.");
        return;
      }
    },
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const onUpdate = useCallback(
    ({ editor }: { editor: EditorType }) => {
      setStatus?.("unsaved");

      const selection = editor.state.selection;

      const lastTwo = editor.state.doc.textBetween(
        selection.from - 2,
        selection.from,
        "\n",
      );

      if (lastTwo === "++" && !isLoading) {
        editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        void complete(editor.getText());
      } else {
        onChange?.(editor.getJSON());
      }
    },
    [complete, isLoading, onChange, setStatus],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", determineMediaType(file)?.toString() ?? "");
      formData.append("projectId", projectId);
      formData.append("postId", postId);

      const media = await createProjectMedia(formData);

      return media.url;
    },
    [postId, projectId],
  );

  const editor = useEditor({
    extensions: [
      ...TiptapExtensions,
      ResizableMediaWithUploader.configure({
        uploadFn: uploadFile,
      }),
    ],
    content: value,
    onUpdate,
    autofocus: "end",
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff, {
      parseOptions: {
        preserveWhitespace: "full",
      },
    });
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };

    const mouseDownHandler = async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();

      if (window.confirm("AI writing paused. Continue?")) {
        await complete(editor?.getText() ?? "");
      }
    };

    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", mouseDownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [stop, isLoading, editor, completion.length, complete]);

  if (!editor) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        editor.chain().focus().run();
      }}
      className="min-h-[500px] w-full py-12 sm:mb-[calc(20vh)]"
    >
      <EditorContent editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <AIBubbleMenu editor={editor} />
      {editor.isActive("table") && <TableMenu editor={editor} />}
    </div>
  );
}
