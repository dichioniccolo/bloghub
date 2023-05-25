"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";
import TextareaMarkdown, {
  type TextareaMarkdownRef,
} from "textarea-markdown-editor";

import { HtmlView, Label, Switch } from "@acme/ui";

import { filesWithTypes, uploadFiles } from "~/lib/editor";
import { cn, markdownToHtml } from "~/lib/utils";
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

// type SuggestionResult = {
//   value: string;
//   label: string;
// };

// type SuggestionPosition = {
//   top: number;
//   left: number;
// };

// type SuggestionType = "mention" | "emoji";

// type SuggestionState = {
//   isOpen: boolean;
//   type: SuggestionType | null;
//   position: SuggestionPosition | null;
//   triggerIndex: number | null;
//   query: string;
// };

// type SuggestionActionType =
//   | {
//       type: "open";
//       payload: {
//         type: SuggestionType;
//         position: SuggestionPosition;
//         triggerIndex: number;
//         query: string;
//       };
//     }
//   | {
//       type: "close";
//     }
//   | {
//       type: "updateQuery";
//       payload: string;
//     };

// function suggestionReducer(
//   state: SuggestionState,
//   action: SuggestionActionType,
// ): SuggestionState {
//   switch (action.type) {
//     case "open": {
//       return {
//         ...state,
//         isOpen: true,
//         type: action.payload.type,
//         position: action.payload.position,
//         triggerIndex: action.payload.triggerIndex,
//         query: action.payload.query,
//       };
//     }
//     case "close": {
//       return {
//         ...state,
//         isOpen: false,
//         type: null,
//         position: null,
//         triggerIndex: null,
//         query: "",
//       };
//     }
//     case "updateQuery": {
//       return {
//         ...state,
//         query: action.payload,
//       };
//     }
//   }
// }

const TOOLBAR_ITEMS = [
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
];

function MarkdownPreview({ markdown }: { markdown?: string }) {
  return (
    <div className="mt-8 border-b pb-6">
      {markdown ? (
        <HtmlView html={markdownToHtml(markdown)} />
      ) : (
        <p>Nothing to preview</p>
      )}
    </div>
  );
}

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
  const [showPreview, setShowPreview] = useState(false);
  // const [suggestionState, dispatchSuggestion] = useReducer(suggestionReducer, {
  //   isOpen: false,
  //   type: null,
  //   position: null,
  //   triggerIndex: null,
  //   query: "",
  // });

  // function closeSuggestion() {
  //   dispatchSuggestion({ type: "close" });
  // }

  function onValueChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.target.value);

    // const {} = getSuggestionData(event.currentTarget);
  }

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
      <div className="flex items-center justify-between gap-4 rounded border px-4 py-px">
        <div className="-ml-2 flex gap-2">
          {TOOLBAR_ITEMS.map((item) => (
            <button
              key={item.commandTrigger}
              type="button"
              onClick={() => {
                textareaMarkdownRef.current?.trigger(item.commandTrigger);
              }}
              className={cn(
                "focus-ring inline-flex h-8 w-8 items-center justify-center rounded focus:border disabled:cursor-default disabled:opacity-50",
                !showPreview && "hover:text-blue transition-colors",
              )}
              disabled={showPreview}
              title={item.name}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="preview"
            checked={showPreview}
            onCheckedChange={setShowPreview}
          />
          <Label htmlFor="preview">Switch Preview</Label>
        </div>
      </div>

      <div
        className={cn("relative mt-2", {
          "sr-only": showPreview,
        })}
      >
        <TextareaMarkdown.Wrapper ref={textareaMarkdownRef}>
          <TextareaAutosize
            {...props}
            value={value}
            onChange={onValueChange}
            onPaste={onPaste}
            onDrop={onDrop}
            onKeyDown={onKeyDown}
            className="focus-ring block w-full rounded border-secondary bg-secondary shadow-sm"
            minRows={minRows}
          />
        </TextareaMarkdown.Wrapper>
      </div>

      {showPreview && <MarkdownPreview markdown={value} />}
    </div>
  );
}

// type SuggestionProps = {
//   state: SuggestionState,
//   onSelect(state: SuggestionResult): void;
//   onClose(): void;
// }

// function Suggestion({ state, onSelect, onClose }: SuggestionProps) {
//   const isMentionType = state.type === 'mention';
//   const isEmojiType = state.type === 'emoji';

// }
