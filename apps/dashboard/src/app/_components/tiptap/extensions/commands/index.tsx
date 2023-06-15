/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { type ReactNode } from "react";
import { Extension, type Editor, type Range } from "@tiptap/core";
import { type Node } from "@tiptap/pm/model";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import Fuse from "fuse.js";
import tippy from "tippy.js";

import { Icons } from "~/app/_components/icons";
import { CommandsListNew } from "./commands-list-new";

type CommandsOption = {
  HTMLAttributes?: Record<string, any>;
  renderLabel?: (props: { options: CommandsOption; node: Node }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

export type CommandSuggestion = {
  title: string;
  description?: string;
  shortcut?: string;
  icon: ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
};

// type CommandSuggestionGroup = {
//   title: string;
//   items: CommandSuggestion[];
// };

// export type CommandSuggestionItems = (
//   | CommandSuggestionGroup
//   | CommandSuggestion
// )[];

export const Commands = Extension.create<CommandsOption>({
  name: "slash-commands",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
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

const commands = [
  {
    title: "Bold",
    shortcut: "**b**",
    icon: <Icons.bold size={24} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setBold().run();
    },
  },

  {
    title: "Heading 1",
    description: "Big heading",
    shortcut: "#",
    icon: <Icons.h1 size={24} />,
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },

  {
    title: "Heading 2",
    icon: <Icons.h2 size={24} />,
    shortcut: "##",
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "Heading 3",
    icon: <Icons.h3 size={24} />,
    shortcut: "###",
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
] as CommandSuggestion[];

const fuse = new Fuse(commands, { keys: ["title", "description", "shortcut"] });

export const SlashCommands = Commands.configure({
  suggestion: {
    items: ({ query }) => {
      return query ? fuse.search(query).map((x) => x.item) : commands;
    },
    render: () => {
      let component: ReactRenderer;
      let popup: { destroy: () => void }[];
      let localProps: Record<string, any> | undefined;

      return {
        onStart(props) {
          localProps = { ...props, event: "" };

          component = new ReactRenderer(CommandsListNew, {
            props: localProps,
            editor: localProps?.editor,
          });

          popup = tippy("body", {
            getReferenceClientRect: localProps.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            animation: "shift-toward-subtle",
            duration: 250,
          });
        },
        onUpdate(props) {
          localProps = { ...props, event: "" };

          component.updateProps(localProps);

          (popup[0] as any).setProps({
            getReferenceClientRect: localProps.clientRect,
          });
        },
        onKeyDown(props) {
          component.updateProps({ ...localProps, event: props.event });

          (component.ref as any).onKeyDown({ event: props.event });

          if (props.event.key === "Escape") {
            (popup[0] as any).hide();

            return true;
          }

          if (props.event.key === "Enter") {
            props.event.stopPropagation();
            props.event.preventDefault();

            return true;
          }

          return false;
        },
        onExit() {
          if (popup && popup[0]) popup[0]?.destroy();
          if (component) component.destroy();
        },
      };
    },
  },
});
