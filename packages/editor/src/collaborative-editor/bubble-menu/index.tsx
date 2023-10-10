import type { Editor } from "@tiptap/core";
import { isNodeSelection, isTextSelection } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";

import { cn } from "@acme/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/tooltip";

import { AiBubbleMenuSelector } from "./ai/ai-bubble-menu-selector";
import { useBubbleMenu } from "./bubble-menu-context";
import { ColorBubbleMenuSelector } from "./color-bubble-menu-selector";
import { ControlledBubbleMenu } from "./controlled-bubble-menu";
import { LinkBubbleMenuSelector } from "./link-bubble-menu-selector";
import { NodeBubbleMenuSelector } from "./node-bubble-menu-selector";

interface Props {
  editor: Editor;
  className?: string;
}

export interface BubbleMenuItem {
  name: string;
  command: () => void;
  isActive: () => boolean;
  icon: (active: boolean) => JSX.Element;
}

export function CustomBubbleMenu({ className, editor }: Props) {
  const {
    setIsNodeSelectorOpen,
    setIsLinkSelectorOpen,
    setIsColorSelectorOpen,
    setIsAiSelectorOpen,
    isFixGrammarAndSpellCheckOpen,
    isSummarizeOpen,
  } = useBubbleMenu();

  const alignItems: BubbleMenuItem[] = [
    {
      name: "Aligh Left",
      icon: (active) => (
        <AlignLeft
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
      command: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
    },
    {
      name: "Align Center",
      icon: (active) => (
        <AlignCenter
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
      command: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
    },
    {
      name: "Align Right",
      icon: (active) => (
        <AlignRight
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
      command: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
    },
    {
      name: "Justify",
      icon: (active) => (
        <AlignJustify
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
      command: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => editor.isActive({ textAlign: "justify" }),
    },
  ];

  const textItems: BubbleMenuItem[] = [
    {
      name: "Bold",
      isActive: () => editor?.isActive("bold") ?? false,
      command: () => editor?.chain().focus().toggleBold().run(),
      icon: (active) => (
        <Bold
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
    },
    {
      name: "Italic",
      isActive: () => editor?.isActive("italic") ?? false,
      command: () => editor?.chain().focus().toggleItalic().run(),
      icon: (active) => (
        <Italic
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
    },
    {
      name: "Underline",
      isActive: () => editor?.isActive("underline") ?? false,
      command: () => editor?.chain().focus().toggleUnderline().run(),
      icon: (active) => (
        <Underline
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
    },
    {
      name: "Strikethrough",
      isActive: () => editor?.isActive("strike") ?? false,
      command: () => editor?.chain().focus().toggleStrike().run(),
      icon: (active) => (
        <Strikethrough
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
    },
    {
      name: "Subscript",
      isActive: () => editor?.isActive("subscript") ?? false,
      command: () => editor?.chain().focus().toggleSubscript().run(),
      icon: (active) => (
        <Subscript
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
    },
    {
      name: "Superscript",
      isActive: () => editor?.isActive("superscript") ?? false,
      command: () => editor?.chain().focus().toggleSuperscript().run(),
      icon: (active) => (
        <Superscript
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
    },
    {
      name: "Code",
      isActive: () => editor?.isActive("code") ?? false,
      command: () => editor?.chain().focus().toggleCode().run(),
      icon: (active) => (
        <Code
          className={cn("h-4 w-4", {
            "text-blue-500": active,
          })}
        />
      ),
    },
  ];

  const shouldShow = () => {
    const { state } = editor;
    const { from, to } = state.selection;

    // Force hide
    if (isFixGrammarAndSpellCheckOpen || isSummarizeOpen) {
      return false;
    }

    const isEmptyTextBlock =
      !state.doc.textBetween(from, to).length &&
      isTextSelection(state.selection);

    if (
      // !view.hasFocus() ||
      state.selection.empty ||
      isEmptyTextBlock ||
      isNodeSelection(state.selection)
    ) {
      return false;
    }

    return true;
  };

  return (
    <ControlledBubbleMenu
      editor={editor}
      open={shouldShow()}
      onOpenChange={() => {
        setIsAiSelectorOpen(false);
        setIsNodeSelectorOpen(false);
        setIsLinkSelectorOpen(false);
        setIsColorSelectorOpen(false);
      }}
    >
      <div
        className={cn(
          "flex w-fit divide-x divide-border rounded border border-border bg-background shadow-xl",
          className,
        )}
      >
        <AiBubbleMenuSelector
          editor={editor}
          setIsOpen={() => {
            setIsAiSelectorOpen((x) => !x);
            setIsNodeSelectorOpen(false);
            setIsLinkSelectorOpen(false);
            setIsColorSelectorOpen(false);
          }}
        />
        <NodeBubbleMenuSelector
          editor={editor}
          setIsOpen={() => {
            setIsAiSelectorOpen(false);
            setIsNodeSelectorOpen((x) => !x);
            setIsLinkSelectorOpen(false);
            setIsColorSelectorOpen(false);
          }}
        />
        <LinkBubbleMenuSelector
          editor={editor}
          setIsOpen={() => {
            setIsAiSelectorOpen(false);
            setIsNodeSelectorOpen(false);
            setIsLinkSelectorOpen((x) => !x);
            setIsColorSelectorOpen(false);
          }}
        />
        <div className="flex">
          {alignItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-2 text-foreground hover:bg-background/90 active:bg-background/90"
                  onClick={item.command}
                >
                  {item.icon(item.isActive())}
                </button>
              </TooltipTrigger>
              <TooltipContent>{item.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex">
          {textItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-2 text-foreground hover:bg-background/90 active:bg-background/90"
                  onClick={item.command}
                >
                  {item.icon(item.isActive())}
                </button>
              </TooltipTrigger>
              <TooltipContent>{item.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
        <ColorBubbleMenuSelector
          editor={editor}
          setIsOpen={() => {
            setIsAiSelectorOpen(false);
            setIsNodeSelectorOpen(false);
            setIsLinkSelectorOpen(false);
            setIsColorSelectorOpen((x) => !x);
          }}
        />
      </div>
    </ControlledBubbleMenu>
  );
}
