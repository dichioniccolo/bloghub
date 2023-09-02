import type { Dispatch, SetStateAction } from "react";
import type { Editor } from "@tiptap/core";
import { Command } from "cmdk";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Check,
  ChevronDown,
} from "lucide-react";

import { cn } from "~/lib/utils";
import type { BubbleMenuItem } from ".";

interface TextAlignSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function TextAlignSelector({
  editor,
  isOpen,
  setIsOpen,
}: TextAlignSelectorProps) {
  const items: BubbleMenuItem[] = [
    {
      name: "Align Left",
      icon: AlignLeft,
      command: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
    },
    {
      name: "Align Center",
      icon: AlignCenter,
      command: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
    },
    {
      name: "Align Right",
      icon: AlignRight,
      command: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
    },
    {
      name: "Align Justify",
      icon: AlignJustify,
      command: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => editor.isActive({ textAlign: "justify" }),
    },
  ];

  const activeItem = items.filter((item) => item.isActive()).pop() ?? items[0]!;

  return (
    <div className="relative h-full">
      <button
        className="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium  hover:bg-muted active:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="whitespace-nowrap">{activeItem?.name}</span>

        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <Command className="fixed top-full z-[99999] mt-1 flex w-48 flex-col gap-1 overflow-hidden rounded border bg-background p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          <Command.List>
            {items.map((item, index) => (
              <Command.Item
                key={index}
                onSelect={() => {
                  item.command();
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-muted",
                )}
              >
                <div className="flex items-center space-x-2">
                  <div className="rounded-sm border p-1">
                    <item.icon className="h-3 w-3" />
                  </div>
                  <span>{item.name}</span>
                </div>
                {activeItem.name === item.name && <Check className="h-4 w-4" />}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      )}
    </div>
  );
}
