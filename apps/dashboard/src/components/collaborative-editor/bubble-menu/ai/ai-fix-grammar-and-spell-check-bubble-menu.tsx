import { useCallback } from "react";
import type { Editor } from "@tiptap/core";
import { isTextSelection } from "@tiptap/core";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import type { BubbleMenuProps } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import { useCompletion } from "ai/react";
import { Command as CommandPrimitive } from "cmdk";
import {
  AlertTriangle,
  Check,
  Loader2,
  Plus,
  Sparkle,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import { Command, CommandItem, CommandList } from "~/components/ui/command";
import { hideOnEsc } from "~/lib/tippy/hide-on-esc";
import { cn } from "~/lib/utils";
import { useAiBubbleMenu } from "./ai-bubble-menu-context";

type Props = Omit<BubbleMenuProps, "children" | "editor"> & {
  editor: Editor;
};

export function AiFixGrammarAndSpellCheckBubbleMenu({
  className,
  editor,
  ...props
}: Props) {
  const { isFixGrammarAndSpellCheckOpen, setIsFixGrammarAndSpellCheckOpen } =
    useAiBubbleMenu();

  const { completion, isLoading, stop } = useCompletion({
    id: "fix_grammar_spelling",
    api: "/api/generate",
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const shouldShow = () => {
    return ({
      state,
      from,
      to,
      view,
    }: {
      state: EditorState;
      from: number;
      to: number;
      view: EditorView;
      editor: Editor;
    }) => {
      if (!isFixGrammarAndSpellCheckOpen) {
        return false;
      }

      // Sometime check for `empty` is not enough
      const isEmptyTextBlock =
        !state.doc.textBetween(from, to).length &&
        isTextSelection(state.selection);

      if (!view.hasFocus() || state.selection.empty || isEmptyTextBlock) {
        stop();
        return false;
      }

      return true;
    };
  };

  const runCommand = useCallback(
    (command: () => unknown) => {
      return () => {
        command();
        setIsFixGrammarAndSpellCheckOpen(false);
      };
    },
    [setIsFixGrammarAndSpellCheckOpen],
  );

  return (
    <BubbleMenu
      {...props}
      pluginKey="aiFixGrammarAndSpellCheckBubbleMenu"
      editor={editor}
      shouldShow={shouldShow()}
      tippyOptions={{
        moveTransition: "transform 0.2s ease-out",
        placement: "bottom",
        plugins: [hideOnEsc],
        onHidden: () => {
          setIsFixGrammarAndSpellCheckOpen(false);
        },
      }}
    >
      <Command className="w-96">
        <div
          className={cn(
            "flex w-full flex-col divide-y divide-border bg-background",
            className,
          )}
        >
          <div className="p-4">
            {completion.length > 0 ? (
              completion
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
          <div
            className="flex items-center border-b px-3"
            // eslint-disable-next-line react/no-unknown-property
            cmdk-input-wrapper=""
          >
            <Sparkle className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
              placeholder="Tell AI what to do next..."
              className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
              {...props}
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
        {completion.length > 0 && (
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
                  .focus(editor.state.selection.to)
                  .newlineInCode()
                  .insertContent(completion)
                  .run();
              })}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border-stone-200 p-1">
                  <Plus className="h-4 w-4" />
                </div>
                <span>Insert below</span>
              </div>
            </CommandItem>
            <CommandItem
              onSelect={runCommand(() => {
                //
              })}
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
    </BubbleMenu>
  );
}
