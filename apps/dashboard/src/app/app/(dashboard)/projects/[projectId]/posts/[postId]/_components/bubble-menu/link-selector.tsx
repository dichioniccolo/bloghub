import type { Dispatch, FC, SetStateAction } from "react";
import { useEffect, useRef } from "react";
import type { Editor } from "@tiptap/core";
import { Check, Trash } from "lucide-react";

import { cn } from "~/lib/cn";

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  return (
    <div className="relative">
      <button
        className="left-0 flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium hover:bg-muted active:bg-muted sm:left-auto"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="text-base">↗</p>
        <p
          className={cn("underline decoration-muted underline-offset-4", {
            "text-blue-500": editor.isActive("link"),
          })}
        >
          Link
        </p>
      </button>
      {isOpen && (
        <div className="fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border bg-background p-1 shadow-xl animate-in fade-in slide-in-from-top-1">
          <input
            ref={inputRef}
            type="url"
            placeholder="Paste a link"
            className="flex-1 bg-background p-1 text-sm outline-none"
            defaultValue={editor.getAttributes("link").href || ""}
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
              className="flex items-center rounded-sm p-1 text-stone-600 transition-all hover:bg-stone-100"
              onClick={() => {
                if (!inputRef.current?.value) {
                  return;
                }

                editor
                  .chain()
                  .focus()
                  .setLink({ href: inputRef.current?.value })
                  .run();
                setIsOpen(false);
              }}
            >
              <Check className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
