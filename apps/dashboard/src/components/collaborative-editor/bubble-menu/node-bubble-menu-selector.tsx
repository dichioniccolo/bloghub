import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import type { Editor } from "@tiptap/core";
import {
  Check,
  CheckSquare,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  Text,
  TextQuote,
} from "lucide-react";

import type { BubbleMenuItem } from ".";

interface Props {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function NodeBubbleMenuSelector({ editor, isOpen, setIsOpen }: Props) {
  const items: BubbleMenuItem[] = [
    {
      name: "Text",
      icon: () => <Text className="h-3 w-3" />,
      command: () =>
        editor?.chain().focus().toggleNode("paragraph", "paragraph").run(),
      isActive: () =>
        editor.isActive("paragraph") &&
        !editor.isActive("bulletList") &&
        !editor.isActive("orderedList"),
    },
    {
      name: "Heading 1",
      icon: () => <Heading1 className="h-3 w-3" />,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: () => <Heading2 className="h-3 w-3" />,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "Heading 3",
      icon: () => <Heading3 className="h-3 w-3" />,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      name: "To-do List",
      icon: () => <CheckSquare className="h-3 w-3" />,
      command: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskItem"),
    },
    {
      name: "Bullet List",
      icon: () => <ListOrdered className="h-3 w-3" />,
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      name: "Numbered List",
      icon: () => <ListOrdered className="h-3 w-3" />,
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      name: "Quote",
      icon: () => <TextQuote className="h-3 w-3" />,
      command: () =>
        editor
          .chain()
          .focus()
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      name: "Code",
      icon: () => <Code className="h-3 w-3" />,
      command: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
  ];

  const activeItem = items.filter((x) => x.isActive()).pop() ?? {
    name: "Multiple",
  };

  const runCommand = useCallback(
    (command: () => unknown) => {
      return () => {
        setIsOpen(false);
        command();
      };
    },
    [setIsOpen],
  );

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-full items-center gap-1 whitespace-nowrap p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => setIsOpen((o) => !o)}
      >
        <span>{activeItem?.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed top-full z-[99999] my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          {items.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={runCommand(item.command)}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 p-1">
                  {item.icon(item.isActive())}
                </div>
                <span>{item.name}</span>
              </div>
              {activeItem.name === item.name && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
