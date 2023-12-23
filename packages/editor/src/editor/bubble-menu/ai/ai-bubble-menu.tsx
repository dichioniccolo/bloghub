import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Editor } from "@tiptap/core";
import { isTextSelection } from "@tiptap/core";
import type { UseCompletionHelpers } from "ai/react";
import { Command as CommandPrimitive } from "cmdk";
import {
  AlertTriangle,
  Check,
  ListPlus,
  Loader2,
  RefreshCcw,
  Sparkle,
  Trash,
} from "lucide-react";

import { cn } from "@acme/ui";
import {
  Command,
  CommandItem,
  CommandList,
} from "@acme/ui/components/ui/command";
import { ScrollArea } from "@acme/ui/components/ui/scroll-area";

import { ControlledBubbleMenu } from "../controlled-bubble-menu";

interface Props {
  editor: Editor;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  completionOptions: UseCompletionHelpers;
}

export function AiBubbleMenu({
  editor,
  open,
  setOpen,
  className,
  completionOptions,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { complete, completion, isLoading, stop } = completionOptions;

  const shouldShow = useMemo(() => {
    const { state } = editor;
    const { from, to } = state.selection;

    if (!open) {
      return false;
    }

    // Sometime check for `empty` is not enough
    const isEmptyTextBlock =
      !state.doc.textBetween(from, to).length &&
      isTextSelection(state.selection);

    if (state.selection.empty || isEmptyTextBlock) {
      stop();
      return false;
    }

    return true;
  }, [editor, open, stop]);

  const runCommand = useCallback(
    (command: () => unknown) => {
      return () => {
        command();
        setOpen(false);
      };
    },
    [setOpen],
  );

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  return (
    <ControlledBubbleMenu
      editor={editor}
      open={shouldShow}
      onOpenChange={() => {
        setOpen(false);
      }}
    >
      <Command className="w-full min-w-full border border-border shadow-xl">
        <div
          className={cn(
            "flex w-full flex-col divide-y divide-border",
            className,
          )}
        >
          <ScrollArea>
            <div className="max-h-56 p-4">
              {completion.length > 0 ? (
                completion
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </ScrollArea>
          <div
            className="flex items-center border-b px-3"
            // eslint-disable-next-line react/no-unknown-property
            cmdk-input-wrapper=""
          >
            <Sparkle className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
              ref={inputRef}
              placeholder="Tell AI what to do next..."
              className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
            />
          </div>
          <div className="flex w-full items-center p-2">
            {!isLoading && completion.length > 0 && (
              <p className="flex items-center gap-2 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <span>AI responses can be inaccurate or misleading.</span>
              </p>
            )}
            {isLoading && (
              <p className="text-sm font-medium">AI is writing...</p>
            )}
          </div>
        </div>
        {completion.length > 0 && !isLoading && (
          <CommandList className="border-t border-border p-2 shadow-xl">
            <CommandItem
              onSelect={runCommand(() => {
                editor
                  .chain()
                  .focus()
                  .insertContentAt(
                    {
                      from: editor.state.selection.from,
                      to: editor.state.selection.to,
                    },
                    completion,
                    {
                      updateSelection: true,
                    },
                  )
                  .run();
              })}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border-stone-200 p-1">
                  <Check className="h-4 w-4" />
                </div>
                <span>Replace selection</span>
              </div>
            </CommandItem>
            <CommandItem
              onSelect={runCommand(() => {
                editor
                  .chain()
                  .focus(editor.state.selection.to + 1)
                  .newlineInCode()
                  .insertContent(completion)
                  .createParagraphNear()
                  .run();
              })}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border-stone-200 p-1">
                  <ListPlus className="h-4 w-4" />
                </div>
                <span>Insert after</span>
              </div>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                const { from, to } = editor.state.selection;

                const text = editor.state.doc.textBetween(from, to);

                void complete(text);
              }}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border-stone-200 p-1">
                  <RefreshCcw className="h-4 w-4" />
                </div>
                <span>Generate again</span>
              </div>
            </CommandItem>
            <CommandItem
              onSelect={() => setOpen(false)}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border-stone-200 p-1">
                  <Trash className="h-4 w-4" />
                </div>
                <span>Discard</span>
              </div>
            </CommandItem>
          </CommandList>
        )}
      </Command>
    </ControlledBubbleMenu>
  );
}
