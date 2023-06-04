"use client";

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { type MDXRemoteSerializeResult } from "next-mdx-remote";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";
import TextareaMarkdown, {
  type CommandHandler,
  type CommandType,
  type TextareaMarkdownRef,
} from "textarea-markdown-editor";

import { Label, MdxContent, Switch } from "@acme/ui";

import { filesWithTypes, uploadFiles } from "~/lib/editor";
import { cn } from "~/lib/utils";
import { Icons } from "./icons";

type MarkdownEditorProps = {
  userId: string;
  projectId: string;
  postId: string;
  value?: string;
  onChange(value: string): void;
  onSubmit(): void;
} & Omit<
  TextareaAutosizeProps,
  "value" | "onChange" | "onKeyDown" | "onInput" | "onPaste" | "onDrop"
>;

type ToolbarItem = {
  commandTrigger:
    | CommandType
    | "align-center"
    | "align-right"
    | "align-left"
    | "align-justify";
  icon: ReactNode;
  name: string;
};

type ToolbarGroup = {
  items: ToolbarItem[];
};

const alignCenterCommandHandler: CommandHandler = () => {
  // cursor.replaceCurrentLines(
  //   (line) => `<div class="text-center">\n${line.text}\n</div>`,
  //   {
  //     selectReplaced: true,
  //   },
  // );
};

const alignRightCommandHandler: CommandHandler = () => {
  // cursor.replaceCurrentLines(
  //   (line) => `<div class="text-right">\n${line.text}\n</div>`,
  //   {
  //     selectReplaced: true,
  //   },
  // );
};

const alignLeftCommandHandler: CommandHandler = () => {
  // cursor.replaceCurrentLines(
  //   (line) => `<div class="text-left">\n${line.text}\n</div>`,
  //   {
  //     selectReplaced: true,
  //   },
  // );
};

const alignJustifyCommandHandler: CommandHandler = () => {
  // cursor.replaceCurrentLines(
  //   (line) => `<div class="text-justify">\n${line.text}\n</div>`,
  //   {
  //     selectReplaced: true,
  //   },
  // );
};

const TOOLBAR_ITEMS: (ToolbarItem | ToolbarGroup)[] = [
  {
    items: [
      {
        commandTrigger: "h1",
        icon: <Icons.h1 className="h-4 w-4" />,
        name: "Heading 1",
      },
      {
        commandTrigger: "h2",
        icon: <Icons.h2 className="h-4 w-4" />,
        name: "Heading 2",
      },
      {
        commandTrigger: "h3",
        icon: <Icons.h3 className="h-4 w-4" />,
        name: "Heading 3",
      },
      {
        commandTrigger: "h4",
        icon: <Icons.h4 className="h-4 w-4" />,
        name: "Heading 4",
      },
    ],
  },
  {
    commandTrigger: "bold",
    icon: <Icons.bold className="h-4 w-4" />,
    name: "Bold",
  },
  {
    commandTrigger: "italic",
    icon: <Icons.italic className="h-4 w-4" />,
    name: "Italic",
  },
  {
    commandTrigger: "unordered-list",
    icon: <Icons.list className="h-4 w-4" />,
    name: "Unordered list",
  },
  {
    commandTrigger: "link",
    icon: <Icons.link className="h-4 w-4" />,
    name: "Link",
  },
  {
    commandTrigger: "code-block",
    icon: <Icons.code className="h-4 w-4" />,
    name: "Code block",
  },
  {
    items: [
      {
        commandTrigger: "align-left",
        icon: <Icons.alignLeft className="h-4 w-4" />,
        name: "Align left",
      },
      {
        commandTrigger: "align-center",
        icon: <Icons.alignCenter className="h-4 w-4" />,
        name: "Align center",
      },
      {
        commandTrigger: "align-right",
        icon: <Icons.alignRight className="h-4 w-4" />,
        name: "Align right",
      },
      {
        commandTrigger: "align-justify",
        icon: <Icons.alignJustify className="h-4 w-4" />,
        name: "Justify",
      },
    ],
  },
];

export function MarkdownEditor({
  userId,
  projectId,
  postId,
  value,
  minRows = 15,
  onChange,
  onSubmit,
  ...props
}: MarkdownEditorProps) {
  const textareaMarkdownRef = useRef<TextareaMarkdownRef>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>();
  const [showPreview, setShowPreview] = useState(false);

  function onValueChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);
  }

  const onTogglePreview = useCallback(async () => {
    if (showPreview) {
      setShowPreview((showPreview) => !showPreview);
      return;
    }

    if (!value) {
      setShowPreview((showPreview) => !showPreview);
      return;
    }

    setLoadingPreview(true);
    const response = await fetch("/api/mdx/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    const { mdxSource } = (await response.json()) as {
      mdxSource: MDXRemoteSerializeResult | null;
    };

    setMdxSource(mdxSource);

    setShowPreview((showPreview) => !showPreview);

    setLoadingPreview(false);
  }, [showPreview, value]);

  async function onDrop(event: DragEvent<HTMLTextAreaElement>) {
    const filesArray = Array.from(event.dataTransfer.files);

    if (filesArray.length === 0) {
      return;
    }

    const files = filesWithTypes(filesArray);

    if (files.length === 0) {
      return;
    }

    event.preventDefault();

    await uploadFiles(userId, projectId, postId, event.currentTarget, files);
  }

  async function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const filesArray = Array.from(event.clipboardData.files);

    if (filesArray.length === 0) {
      return;
    }

    const files = filesWithTypes(filesArray);

    if (files.length === 0) {
      return;
    }

    event.preventDefault();

    await uploadFiles(userId, projectId, postId, event.currentTarget, files);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const { code, metaKey } = event;

    if (showPreview) {
      event.preventDefault();
    }

    if (code === "Enter" && metaKey) {
      onSubmit();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 rounded border px-4">
        <div className="-ml-2 flex gap-2 py-2">
          {TOOLBAR_ITEMS.map((item, index) => {
            if ("items" in item) {
              return (
                <div
                  key={index}
                  className="flex divide-x rounded-md border border-border"
                >
                  {item.items.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        textareaMarkdownRef.current?.trigger(
                          item.commandTrigger,
                        );
                      }}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center rounded focus:border disabled:cursor-default disabled:opacity-50",
                        !showPreview && "hover:text-blue transition-colors",
                      )}
                      disabled={showPreview}
                      title={item.name}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              );
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  textareaMarkdownRef.current?.trigger(item.commandTrigger);
                }}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded focus:border disabled:cursor-default disabled:opacity-50",
                  !showPreview && "hover:text-blue transition-colors",
                )}
                disabled={showPreview}
                title={item.name}
              >
                {item.icon}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {loadingPreview && <Icons.spinner className="h-4 w-4 animate-spin" />}
          <Switch
            id="preview"
            checked={showPreview}
            onCheckedChange={onTogglePreview}
          />
          <Label htmlFor="preview">Switch Preview</Label>
        </div>
      </div>

      <div
        className={cn("relative mt-2", {
          "sr-only": showPreview,
        })}
      >
        <TextareaMarkdown.Wrapper
          ref={textareaMarkdownRef}
          commands={[
            {
              name: "align-center",
              handler: alignCenterCommandHandler,
            },
            {
              name: "align-left",
              handler: alignLeftCommandHandler,
            },
            {
              name: "align-right",
              handler: alignRightCommandHandler,
            },
            {
              name: "align-justify",
              handler: alignJustifyCommandHandler,
            },
          ]}
        >
          <TextareaAutosize
            {...props}
            value={value}
            onChange={onValueChange}
            onPaste={onPaste}
            onDrop={onDrop}
            onKeyDown={onKeyDown}
            className="block w-full rounded border-secondary bg-transparent shadow-sm"
            minRows={minRows}
          />
        </TextareaMarkdown.Wrapper>
      </div>
      {!loadingPreview && showPreview && mdxSource && (
        <MdxContent source={mdxSource} />
      )}
    </div>
  );
}
