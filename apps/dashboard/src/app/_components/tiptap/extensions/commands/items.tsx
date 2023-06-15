import { type ReactNode } from "react";
import { type Editor, type Range } from "@tiptap/core";

import { Icons } from "~/app/_components/icons";

export type CommandSuggestion = {
  title: string;
  description?: string;
  shortcut?: string;
  icon: ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
};

export const commands = [
  {
    title: "H1",
    description: "Big heading",
    shortcut: "#",
    icon: <Icons.h1 size={24} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "H2",
    description: "Medium heading",
    icon: <Icons.h2 size={24} />,
    shortcut: "##",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "H3",
    description: "Small heading",
    icon: <Icons.h3 size={24} />,
    shortcut: "###",
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "Bold",
    shortcut: "**b**",
    icon: <Icons.bold size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBold().run();
    },
  },
  {
    title: "Italic",
    shortcut: "*i*",
    icon: <Icons.italic size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setItalic().run();
    },
  },
  {
    title: "Strike",
    shortcut: "~~s~~",
    icon: <Icons.strikeThrough size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setStrike().run();
    },
  },
  {
    title: "Image",
    icon: <Icons.image size={24} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setImage({
          src: "",
        })
        .run();
    },
  },
] as CommandSuggestion[];
