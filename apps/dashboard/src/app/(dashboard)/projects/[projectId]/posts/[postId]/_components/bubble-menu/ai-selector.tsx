import { useEffect, type FC } from "react";
import { useCompletion } from "ai/react/dist";
import {
  CheckCheck,
  ChevronDown,
  CornerDownLeft,
  Sparkles,
  Wand,
} from "lucide-react";

import { type Editor } from "@acme/editor";
import { Command, CommandItem, CommandList } from "@acme/ui";

type Props = {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const AISelector: FC<Props> = ({ editor, isOpen, setIsOpen }) => {
  const items = [
    {
      name: "Improve writing",
      icon: Wand,
    },
    {
      name: "Fix spelling & grammar",
      icon: CheckCheck,
    },
  ];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
    } else {
      document.removeEventListener("keydown", onKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const { complete } = useCompletion({
    id: "editor-edit",
    api: "/api/generate",
  });

  return (
    <div className="relative h-full">
      <button
        className="hover:bg-stone:100 flex h-full items-center gap-1 border-r border-border p-2 text-sm font-medium text-purple-500 active:bg-stone-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sparkles className="h-4 w-4" />
        <span className="whitespace-nowrap">Ask AI</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <Command className="fixed top-full z-[99999] mt-1 w-60">
          <CommandList>
            {items.map((item, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  const { from, to } = editor.state.selection;
                  const text = editor.state.doc.textBetween(from, to);
                  void complete(text);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4 text-purple-500" />
                  <span>{item.name}</span>
                </div>
                <CornerDownLeft className="invisible h-4 w-4 aria-selected:visible" />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      )}
    </div>
  );
};
