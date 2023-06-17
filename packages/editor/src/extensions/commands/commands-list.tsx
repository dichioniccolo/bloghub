import { useCallback, useEffect, useState } from "react";
import { type Editor, type Range } from "@tiptap/core";

import { type CommandItemProps } from "./items";

type Props = {
  items: CommandItemProps[];
  command: (item: CommandItemProps, editor: Editor, range: Range) => void;
  editor: Editor;
  range: Range;
};

export const CommandList = ({ items, command, editor, range }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // const { complete, isLoading } = useCompletion({
  //   id: "novel",
  //   api: "/api/generate",
  //   onResponse: (response) => {
  //     if (response.status === 429) {
  //       toast.error("You have reached your request limit for the day.");
  //       va.track("Rate Limit Reached");
  //       return;
  //     }
  //     editor.chain().focus().deleteRange(range).run();
  //   },
  //   onFinish: (_prompt, completion) => {
  //     // highlight the generated text
  //     editor.commands.setTextSelection({
  //       from: range.from,
  //       to: range.from + completion.length,
  //     });
  //   },
  //   onError: () => {
  //     toast.error("Something went wrong.");
  //   },
  // });

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      // va.track("Slash Command Used", {
      //   command: item.title,
      // });
      if (item) {
        // if (item.title === "Continue writing") {
        //   const text = editor.getText();
        //   complete(text);
        // } else {
        command(item, editor, range);
        // }
      }
    },
    [command, items, editor, range],
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (!navigationKeys.includes(e.key)) {
        return;
      }
      e.preventDefault();
      if (e.key === "ArrowUp") {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        return true;
      }
      if (e.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % items.length);
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

  return items.length > 0 ? (
    <div className="z-50 h-auto max-h-[350px] w-72 overflow-y-auto rounded-md border border-gray-200 bg-white px-1 py-2 shadow-md transition-all">
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
              {/* {item.title === "Continue writing" && isLoading ? (
                <LoadingCircle />
              ) : (
                item.icon
              )} */}
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
