import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { cn } from "~/lib/utils";
import { type CommandSuggestion } from "./index";

type Props = {
  items: CommandSuggestion[];
  command: (props: CommandSuggestion) => void;
};

export const CommandsList = forwardRef(function CommandsListNew(
  { items, command }: Props,
  ref,
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };
  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        event.stopPropagation();
        event.preventDefault();
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        event.stopPropagation();
        event.preventDefault();
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        event.stopPropagation();
        event.preventDefault();
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  const selectItem = (index: number) => {
    const item = items[index];

    if (item) setTimeout(() => command(item));
  };

  return (
    <ul className="w-64 overflow-auto rounded-xl border bg-white py-1.5 shadow-sm dark:border-2 dark:border-gray-800 dark:bg-gray-900">
      {items.length === 0 ? (
        <p className="px-4 py-2 text-gray-500">No commands found</p>
      ) : (
        items.map((item, index) => (
          <li key={index}>
            <button
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 p-2 text-left transition hover:bg-blue-100 focus:outline-none dark:hover:bg-blue-400/10",
                {
                  "bg-blue-100/50 dark:bg-blue-400/10": selectedIndex === index,
                },
              )}
              onClick={() => selectItem(index)}
              onMouseEnter={() => setSelectedIndex(index)}
              onKeyDown={(e) => e.code === "Enter" && selectItem(index)}
            >
              <div>
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded border border-slate-400 bg-white text-gray-500",
                    {
                      "dark:text-blue-300": selectedIndex === index,
                    },
                  )}
                >
                  {item.icon}
                </span>
              </div>
              <div className="w-full leading-tight">
                <div
                  className={
                    selectedIndex === index
                      ? "dark:text-blue-300"
                      : "dark:text-gray-500"
                  }
                >
                  {item.title}
                </div>
                <div className="flex w-full justify-between">
                  {item.description && (
                    <span className="text-xs text-gray-400">
                      {item.description}
                    </span>
                  )}
                  {item.shortcut && (
                    <code className="text-xs text-gray-400">
                      {item.shortcut}
                    </code>
                  )}
                </div>
              </div>
              {/* <span className="flex items-center gap-2">

                <span>{item.title}</span>
              </span>
              {item.shortcut && <code>{item.shortcut}</code>} */}
            </button>
          </li>
        ))
      )}
    </ul>
  );
});
