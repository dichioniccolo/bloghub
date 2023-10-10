import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import type { Editor } from "@tiptap/core";
import { CheckCheck, ChevronDown, Quote, Sparkles } from "lucide-react";

import { Command, CommandItem, CommandList } from "@acme/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@acme/ui/components/popover";

import { useBubbleMenu } from "../bubble-menu-context";
import {
  useFixGrammarAndSpellCheck,
  useSummarizeCompletion,
} from "./use-ai-completion";

interface Props {
  editor: Editor;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function AiBubbleMenuSelector({ editor, setIsOpen }: Props) {
  const {
    isAiSelectorOpen,
    setIsFixGrammarAndSpellCheckOpen,
    setIsSummarizeOpen,
  } = useBubbleMenu();

  const { complete: fixGrammarAndSpellCheck } = useFixGrammarAndSpellCheck();
  const { complete: summarize } = useSummarizeCompletion();

  const runCommand = useCallback(
    (command: () => unknown) => {
      return () => {
        setIsOpen(false);
        command();
      };
    },
    [setIsOpen],
  );

  return (
    <Popover open={isAiSelectorOpen}>
      <div className="relative">
        <PopoverTrigger
          type="button"
          className="flex h-full items-center gap-1 p-2 text-sm font-medium text-purple-500 hover:bg-stone-100 active:bg-stone-200"
          onClick={() => setIsOpen(!isAiSelectorOpen)}
        >
          <Sparkles className="h-4 w-4" />
          <span className="whitespace-nowrap">Ask AI</span>
          <ChevronDown className="h-4 w-4" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="my-1 flex max-h-80 flex-col overflow-hidden overflow-y-auto border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        >
          <Command>
            <CommandList>
              <CommandItem
                className="flex items-center justify-between px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
                onSelect={runCommand(() => {
                  setIsFixGrammarAndSpellCheckOpen(true);
                  setIsSummarizeOpen(false);

                  const { from, to } = editor.state.selection;

                  const text = editor.state.doc.textBetween(from, to);

                  void fixGrammarAndSpellCheck(text);
                })}
              >
                <div className="flex items-center space-x-2">
                  <CheckCheck className="h-4 w-4 text-purple-500" />
                  <span>Fix spelling & grammar</span>
                </div>
              </CommandItem>

              <CommandItem
                className="flex items-center justify-between px-2 py-1 text-sm text-stone-600 hover:bg-stone-100"
                onSelect={runCommand(() => {
                  setIsFixGrammarAndSpellCheckOpen(false);
                  setIsSummarizeOpen(true);

                  const { from, to } = editor.state.selection;

                  const text = editor.state.doc.textBetween(from, to);

                  void summarize(text);
                })}
              >
                <div className="flex items-center space-x-2">
                  <Quote className="h-4 w-4 text-purple-500" />
                  <span>Summarize</span>
                </div>
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
