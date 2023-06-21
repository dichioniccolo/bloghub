/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Extension, type Editor, type Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import tippy, { type Instance } from "tippy.js";

import { CommandList } from "./commands-list";
import { getSuggestionItems, type CommandItemProps } from "./items";

interface Command {
  editor: Editor;
  range: Range;
}

type Options = {
  // additionalCommands?: ({
  //   editor,
  //   query,
  // }: {
  //   editor: Editor;
  //   query: string;
  // }) => Array<CommandItemProps>;
  suggestion?: Partial<SuggestionOptions<CommandItemProps>>;
};

const Command = Extension.create<Options>({
  name: "slash-command",
  addOptions() {
    return {
      extraCommands: [],
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: () => {
      let component: ReactRenderer | null = null;
      let popup: Array<Instance> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(CommandList, {
            props,
            editor: props.editor,
          });

          popup = tippy("body", {
            getReferenceClientRect: () => props.clientRect!()!,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },
        onUpdate: (props) => {
          component?.updateProps(props);

          popup &&
            popup[0]?.setProps({
              getReferenceClientRect: () => props.clientRect!()!,
            });
        },
        onKeyDown: (props) => {
          if (props.event.key === "Escape") {
            popup?.[0]?.hide();

            return true;
          }

          // @ts-expect-error we don't know the ref
          return component?.ref?.onKeyDown(props);
        },
        onExit: () => {
          popup?.[0]?.destroy();
          component?.destroy();
        },
      };
    },
  },
});
