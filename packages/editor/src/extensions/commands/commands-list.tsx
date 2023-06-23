import { type Editor, type Range } from "@tiptap/core";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { type CommandItemProps } from "./items";

type Props = {
  items: CommandItemProps[];
  command: (item: CommandItemProps, editor: Editor, range: Range) => void;
  editor: Editor;
  range: Range;
};

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

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) {
        return;
      }

      // ideally here we'd want to call the handler for the selected item.
      // this could be even put react contexts, in order to be able to use
      command(item, editor, range);
    },
    [items, command, editor, range],
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

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      id="slash-command"
      ref={commandListContainer}
      className="z-50 h-auto max-h-[350px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${
              index === selectedIndex ? "bg-stone-100 text-stone-900" : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-stone-500">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};
