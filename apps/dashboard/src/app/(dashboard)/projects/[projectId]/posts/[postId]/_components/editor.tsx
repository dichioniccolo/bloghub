import { useCallback, useEffect, useRef } from "react";
import { useCompletion } from "ai/react";

import {
  ColorHighlighter,
  EditableImageExtension,
  EditorContent,
  HorizontalRuleExtension,
  Placeholder,
  SlashCommand,
  SmileReplacer,
  StarterKit,
  TiptapLink,
  Underline,
  // useConnection,
  // useConnectionStatus,
  useEditor,
  Youtube,
  type Editor as EditorType,
  type JSONContent,
} from "@acme/editor";
import { toast } from "@acme/ui";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
import { EditorBubbleMenu } from "./bubble-menu";
import { AIBubbleMenu } from "./bubble-menu/ai";

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
  const user = useUser();

  // useConnection();
  // const connectionStatus = useConnectionStatus();

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "editor",
    api: "/api/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      ColorHighlighter,
      HorizontalRuleExtension,
      EditableImageExtension(user.id, projectId, postId),
      Placeholder,
      SlashCommand,
      SmileReplacer,
      TiptapLink,
      Youtube,
      Underline,
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
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        editor.chain().focus().run();
      }}
      className="relative min-h-[500px] w-full px-0 py-12 sm:mb-[20vh]"
    >
      <EditorContent editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <AIBubbleMenu editor={editor} />
      {/* <footer className="bottom-8 flex flex-row items-center text-sm">
        <div
          className={
            "before:content-[' '] flex items-center gap-1.5 before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500"
          }
          data-status={connectionStatus}
        >
          {connectionStatus === "connected"
            ? `${editor.storage.collaborationCursor.users.length} user${
                editor.storage.collaborationCursor.users.length === 1 ? "" : "s"
              } online`
            : "offline"}
        </div>
        <div
          className="ml-auto rounded-lg border border-stone-100 px-2 py-1 transition-colors hover:border-stone-400"
          style={{
            opacity: user.name ? 1 : 0,
          }}
        >
          {user.name}
        </div>
      </footer> */}
    </div>
  );
}
