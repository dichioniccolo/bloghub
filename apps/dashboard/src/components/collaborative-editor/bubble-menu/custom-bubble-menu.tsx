import { useState } from "react";
import type { BubbleMenuProps, Editor } from "@tiptap/react";
import { BubbleMenu, isNodeSelection } from "@tiptap/react";
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

import { hideOnEsc } from "~/lib/tippy/hide-on-esc";
import { cn } from "~/lib/utils";
import { ColorBubbleMenuSelector } from "./color-bubble-menu-selector";
import { LinkBubbleMenuSelector } from "./link-bubble-menu-selector";
import { NodeBubbleMenuSelector } from "./node-bubble-menu-selector";

type Props = { editor: Editor } & Omit<BubbleMenuProps, "children" | "editor">;

export interface BubbleMenuItem {
  name: string;
  command: () => void;
  isActive: () => boolean;
  icon: (active: boolean) => JSX.Element;
}

export function CustomBubbleMenu({ className, editor, ...props }: Props) {
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);

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
      name: "Align Justify",
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
      name: "bold",
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
      name: "italic",
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
      name: "underline",
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
      name: "strike",
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
      name: "subscript",
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
      name: "superscript",
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
      name: "code",
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

  return (
    <BubbleMenu
      {...props}
      editor={editor}
      shouldShow={({ view, state, editor }) => {
        const { selection } = state;
        const { empty } = selection;

        if (
          editor.isActive("codeBlock") ||
          editor.isActive("image") ||
          !view.hasFocus() ||
          empty ||
          isNodeSelection(selection)
        ) {
          return false;
        }
        return true;
      }}
      tippyOptions={{
        moveTransition: "transform 0.15s ease-out",
        plugins: [hideOnEsc],
        onHidden: () => {
          setIsNodeSelectorOpen(false);
          setIsLinkSelectorOpen(false);
          setIsColorSelectorOpen(false);
        },
      }}
      className={cn(
        "flex w-fit divide-x divide-border rounded border border-border bg-background shadow-xl",
        className,
      )}
    >
      <NodeBubbleMenuSelector
        editor={editor}
        isOpen={isNodeSelectorOpen}
        setIsOpen={() => {
          setIsNodeSelectorOpen((x) => !x);
          setIsLinkSelectorOpen(false);
          setIsColorSelectorOpen(false);
        }}
      />
      <LinkBubbleMenuSelector
        editor={editor}
        isOpen={isLinkSelectorOpen}
        setIsOpen={() => {
          setIsNodeSelectorOpen(false);
          setIsLinkSelectorOpen((x) => !x);
          setIsColorSelectorOpen(false);
        }}
      />
      <div className="flex">
        {alignItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className="p-2 text-foreground hover:bg-background/90 active:bg-background/90"
            onClick={item.command}
          >
            {item.icon(item.isActive())}
          </button>
        ))}
      </div>
      <div className="flex">
        {textItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className="p-2 text-foreground hover:bg-background/90 active:bg-background/90"
            onClick={item.command}
          >
            {item.icon(item.isActive())}
          </button>
        ))}
      </div>
      <ColorBubbleMenuSelector
        editor={editor}
        isOpen={isColorSelectorOpen}
        setIsOpen={() => {
          setIsNodeSelectorOpen(false);
          setIsLinkSelectorOpen(false);
          setIsColorSelectorOpen((x) => !x);
        }}
      />
    </BubbleMenu>
  );
}
