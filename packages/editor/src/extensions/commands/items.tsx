import { type ReactNode } from "react";
import { type Editor, type Range } from "@tiptap/core";
import {
  Divide,
  Heading1,
  Heading2,
  Heading3,
  Image,
  List,
  ListOrdered,
  Video,
} from "lucide-react";

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
    icon: <Heading1 size={24} />,
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
    icon: <Heading2 size={24} />,
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
    icon: <Heading3 size={24} />,
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
    icon: <List size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a simple numbered list",
    icon: <ListOrdered size={24} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  // {
  //   title: "Link",
  //   description: "Create a link",
  //   icon: <Link size={24} />,
  //   // command: ({ editor, range }) => {
  //   //   editor.chain().focus().deleteRange(range).setLink({ href: '' }).run();
  //   // }
  // },
  {
    title: "Divider",
    description: "insert a dividing line",
    icon: <Divide size={24} />,
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
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image size={24} />,
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
    icon: <Video size={24} />,
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
