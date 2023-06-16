import {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type RefObject,
} from "react";

import { cn } from "../../lib/utils";
import { type CommandSuggestion } from "./items";

type Props = {
  items: CommandSuggestion[];
  command: (props: CommandSuggestion) => void;
};

export const CommandsList = forwardRef(function CommandsListNew(
  { items, command }: Props,
  ref,
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const refs = useMemo(
    () =>
      items.reduce((acc, _item, index) => {
        acc[index] = createRef();
        return acc;
      }, {} as Record<string, RefObject<HTMLLIElement>>),
    [items],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const scrollTo = (ref?: RefObject<HTMLLIElement>) => {
    ref?.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex) => {
      const newIndex = (selectedIndex + 1) % items.length;
      scrollTo(refs[newIndex]);
      return newIndex;
    });
  };
  const upHandler = () => {
    setSelectedIndex((selectedIndex) => {
      const newIndex = (selectedIndex + items.length - 1) % items.length;
      scrollTo(refs[newIndex]);
      return newIndex;
    });
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
    <ul className="max-h-80 w-72 overflow-auto rounded-xl border bg-white py-1.5 shadow-sm dark:border-2 dark:border-gray-800 dark:bg-gray-900">
      {items.length === 0 ? (
        <p className="px-4 py-2 text-gray-500">No commands found</p>
      ) : (
        items.map((item, index) => (
          <li key={index} ref={refs[index]}>
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
            </button>
          </li>
        ))
      )}
    </ul>
  );
});
