import type { ElementRef } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Editor, Range } from "@tiptap/core";
import { useCompletion } from "ai/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getPrevText } from "../..";
import type { CommandItemProps } from "./items";

interface Props {
  items: CommandItemProps[];
  command: (item: CommandItemProps) => void;
  editor: Editor;
  range: Range;
}

const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

export const CommandList = ({ items, command, editor, range }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { complete, isLoading } = useCompletion({
    id: "editor",
    api: "/api/generate",
    onResponse: () => {
      editor.chain().focus().deleteRange(range).run();
    },
    onFinish: (_prompt, completion) => {
      // highlight the generated text
      editor.commands.setTextSelection({
        from: range.from,
        to: range.from + completion.length,
      });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        if (item.title === "Continue writing") {
          // we're using this for now until we can figure out a way to stream markdown text with proper formatting: https://github.com/steven-tey/novel/discussions/7
          void complete(
            getPrevText(editor, {
              chars: 5000,
              offset: 1,
            }),
          );
        } else {
          command(item);
        }
      }
    },
    [complete, command, editor, items],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        return;
      }
      e.preventDefault();

      if (e.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex) => (selectedIndex + items.length - 1) % items.length,
        );
        return true;
      }
      if (e.key === "ArrowDown") {
        setSelectedIndex((selectedIndex) => (selectedIndex + 1) % items.length);
        return true;
      }
      if (e.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<ElementRef<"div">>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      id="slash-command"
      ref={commandListContainer}
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border bg-background px-1 py-2 shadow-md transition-all"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-muted ${
              index === selectedIndex ? "bg-stone-100 text-stone-900" : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-foreground text-primary">
              {item.title === "Continue writing" && isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                item.icon
              )}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};
