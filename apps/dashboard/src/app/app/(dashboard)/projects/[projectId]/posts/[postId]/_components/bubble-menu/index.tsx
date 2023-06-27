import { useState } from "react";
import { BubbleMenu, BubbleMenuProps } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

import { cn } from "~/lib/cn";
import { AISelector } from "./ai-selector";
import { ColorSelector } from "./color-selector";
import { NodeSelector } from "./node-selector";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export function EditorBubbleMenu({ editor, ...props }: EditorBubbleMenuProps) {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => editor.isActive("bold"),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => editor.isActive("italic"),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: () => editor.isActive("underline"),
      command: () => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: () => editor.isActive("strike"),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: () => editor.isActive("code"),
      command: () => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    editor,
    shouldShow: ({ editor }) => {
      if (editor.isActive("resizableMedia") || editor.isActive("image")) {
        return false;
      }

      return editor.view.state.selection.content().size > 0;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsAISelectorOpen(false);
        setIsNodeSelectorOpen(false);
        setIsColorSelectorOpen(false);
      },
    },
  };

  const [isAISelectorOpen, setIsAISelectorOpen] = useState(false);
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex w-fit overflow-hidden rounded border border-stone-200 bg-white shadow-xl"
    >
      <AISelector
        editor={editor}
        isOpen={isAISelectorOpen}
        setIsOpen={() => {
          setIsAISelectorOpen(!isAISelectorOpen);
          setIsNodeSelectorOpen(false);
          setIsColorSelectorOpen(false);
        }}
      />
      <NodeSelector
        editor={editor}
        isOpen={isNodeSelectorOpen}
        setIsOpen={() => {
          setIsNodeSelectorOpen(!isNodeSelectorOpen);
          setIsColorSelectorOpen(false);
          setIsAISelectorOpen(false);
        }}
      />

      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.command}
          className="p-2 text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        >
          <item.icon
            className={cn("h-4 w-4", {
              "text-blue-500": item.isActive(),
            })}
          />
        </button>
      ))}
      <ColorSelector
        editor={editor}
        isOpen={isColorSelectorOpen}
        setIsOpen={() => {
          setIsColorSelectorOpen(!isColorSelectorOpen);
          setIsNodeSelectorOpen(false);
          setIsAISelectorOpen(false);
        }}
      />
    </BubbleMenu>
  );
}
