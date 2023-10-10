import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import type { Editor } from "@tiptap/core";
import { Check, Trash } from "lucide-react";

import { getUrlFromString } from "@acme/lib/utils";
import { cn } from "@acme/ui";

import { useBubbleMenu } from "./bubble-menu-context";

interface Props {
  editor: Editor;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function LinkBubbleMenuSelector({ editor, setIsOpen }: Props) {
  const { isLinkSelectorOpen } = useBubbleMenu();

  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  return (
    <div className="relative h-full">
      <button
        type="button"
        className="flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200"
        onClick={() => setIsOpen(!isLinkSelectorOpen)}
      >
        <p className="text-base">↗</p>
        <p
          className={cn("underline decoration-stone-400 underline-offset-4", {
            "text-blue-500": editor.isActive("link"),
          })}
        >
          Link
        </p>
      </button>
      {isLinkSelectorOpen && (
        <div className="fixed top-full z-[99999] my-1 flex max-h-80 flex-col overflow-hidden overflow-y-auto rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          <div className="flex">
            <input
              ref={inputRef}
              type="text"
              placeholder="Paste a link"
              className="flex-1 bg-white p-1 text-sm outline-none"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              defaultValue={editor.getAttributes("link").href || ""}
              onKeyDown={(e) => {
                if (e.key !== "Enter") {
                  return;
                }

                e.preventDefault();

                if (!inputRef.current) {
                  return;
                }

                const url = getUrlFromString(inputRef.current.value);
                url && editor.chain().focus().setLink({ href: url }).run();
                setIsOpen(false);
              }}
            />
            {editor.getAttributes("link").href ? (
              <button
                type="button"
                className="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setIsOpen(false);
                }}
              >
                <Trash className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!inputRef.current) {
                    return;
                  }

                  const url = getUrlFromString(inputRef.current.value);
                  url && editor.chain().focus().setLink({ href: url }).run();
                  setIsOpen(false);
                }}
                className="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
