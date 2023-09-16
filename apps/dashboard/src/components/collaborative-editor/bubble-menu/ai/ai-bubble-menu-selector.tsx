import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import type { Editor } from "@tiptap/core";
import { useCompletion } from "ai/react";
import { CheckCheck, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Command, CommandItem, CommandList } from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useBubbleMenu } from "../bubble-menu-context";

interface Props {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function AiBubbleMenuSelector({ editor, isOpen, setIsOpen }: Props) {
  const { setIsFixGrammarAndSpellCheckOpen } = useBubbleMenu();

  const { complete } = useCompletion({
    id: "fix_grammar_spelling",
    api: "/api/generate",
    body: {
      type: "fix_grammar_spelling",
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
    <Popover open={isOpen}>
      <div className="relative">
        <PopoverTrigger
          type="button"
          className="flex h-full items-center gap-1 p-2 text-sm font-medium text-purple-500 hover:bg-stone-100 active:bg-stone-200"
          onClick={() => setIsOpen(!isOpen)}
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
                  const { from, to } = editor.state.selection;

                  const text = editor.state.doc.textBetween(from, to);

                  void complete(text);
                })}
              >
                <div className="flex items-center space-x-2">
                  <CheckCheck className="h-4 w-4 text-purple-500" />
                  <span>Fix spelling & grammar</span>
                </div>
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
}
