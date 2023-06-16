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
    title: "Bullet List",
    description: "Create a simple bullet list",
    icon: <Icons.list size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("bulletList").run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a simple numbered list",
    icon: <Icons.listOrdered size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("orderedList").run();
    },
  },
  {
    title: "Link",
    description: "Create a link",
    icon: <Icons.link size={24} />,
    // command: ({ editor, range }) => {
    //   editor.chain().focus().deleteRange(range).setLink({ href: '' }).run();
    // }
  },
  {
    title: "Divider",
    description: "insert a dividing line",
    icon: <Icons.divider size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  // {
  //   title: "Bold",
  //   shortcut: "**b**",
  //   icon: <Icons.bold size={24} />,
  //   command: ({ editor, range }) => {
  //     editor.chain().focus().deleteRange(range).setBold().run();
  //   },
  // },
  // {
  //   title: "Italic",
  //   shortcut: "*i*",
  //   icon: <Icons.italic size={24} />,
  //   command: ({ editor, range }) => {
  //     editor.chain().focus().deleteRange(range).setItalic().run();
  //   },
  // },
  // {
  //   title: "Strike",
  //   shortcut: "~~s~~",
  //   icon: <Icons.strikeThrough size={24} />,
  //   command: ({ editor, range }) => {
  //     editor.chain().focus().deleteRange(range).setStrike().run();
  //   },
  // },
  {
    title: "Image",
    description: "Upload an image",
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
  {
    title: "Video",
    description: "Upload a video",
    icon: <Icons.video size={24} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setVideo({
          src: "",
        })
        .run();
    },
  },
] as CommandSuggestion[];
