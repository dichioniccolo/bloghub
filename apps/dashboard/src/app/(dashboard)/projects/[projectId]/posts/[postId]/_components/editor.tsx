import { useCallback, useEffect, useRef } from "react";
import { useCompletion } from "ai/react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createProjectMedia } from "@acme/common/actions";
import type { MediaEnumType } from "@acme/db";
import {
  Color,
  ColorHighlighter,
  EditorContent,
  HorizontalRuleExtension,
  Placeholder,
  ResizableMediaWithUploader,
  SlashCommand,
  SmileReplacer,
  StarterKit,
  TaskItem,
  TaskList,
  TextStyle,
  TiptapLink,
  Underline,
  useEditor,
  Youtube,
  type Editor as EditorType,
  type JSONContent,
  type Range,
} from "@acme/editor";
import { Table, TableCell, TableHeader, TableRow } from "@acme/editor/index";

import { Icons } from "~/app/_components/icons";
import { useUser } from "~/hooks/use-user";
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
  const user = useUser();

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
      formData.append("userId", user.id);
      formData.append("projectId", projectId);
      formData.append("postId", postId);

      const media = await createProjectMedia(formData);

      return media.url;
    },
    [postId, projectId, user.id],
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      ColorHighlighter,
      HorizontalRuleExtension,
      ResizableMediaWithUploader.configure({
        uploadFn: uploadFile,
      }),
      Placeholder,
      SlashCommand.configure({
        suggestion: {
          items: async ({ query, editor }) =>
            [
              {
                title: "Continue writing",
                description: "Use AI to expand your thoughts",
                searchTerms: ["gpt"],
                icon: <Sparkles className="h-7 w-7" />,
                command: ({
                  editor,
                  range,
                }: {
                  editor: EditorType;
                  range: Range;
                }) => {
                  if (isLoading) {
                    stop();
                  } else {
                    editor.commands.deleteRange(range);
                    void complete(editor.getText());
                  }
                },
              },
              ...((await SlashCommand.options?.suggestion?.items?.({
                query,
                editor,
              })) ?? []),
            ].filter((item) => {
              if (typeof query === "string" && query.length > 0) {
                const search = query.toLowerCase();
                return (
                  item.title.toLowerCase().includes(search) ||
                  item.description.toLowerCase().includes(search) ||
                  (item.searchTerms &&
                    item.searchTerms.some((term: string) =>
                      term.includes(search),
                    ))
                );
              }
              return true;
            }),
        },
      }),
      SmileReplacer,
      TiptapLink,
      Youtube,
      Underline,
      TextStyle,
      Color,
      TaskItem,
      TaskList,
      Table,
      TableCell,
      TableHeader,
      TableRow,
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
      className="min-h-[500px] w-full p-12 px-8 sm:mb-[calc(20vh)] sm:px-12"
    >
      <EditorContent editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <AIBubbleMenu editor={editor} />
      {editor.isActive("table") && <TableMenu editor={editor} />}
    </div>
  );
}
