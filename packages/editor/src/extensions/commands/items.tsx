import { type ReactNode } from "react";
import { type Editor, type Range } from "@tiptap/core";
import {
  Code,
  Divide,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  TextQuote,
} from "lucide-react";

type Command = {
  editor: Editor;
  range: Range;
};

export type CommandItemProps = {
  title: string;
  description: string;
  icon: ReactNode;
  command: (command: Command) => unknown;
};

export const getSuggestionItems = ({ query }: { query: string }) => {
  return (
    [
      // {
      //   title: "Continue writing",
      //   description: "Use AI to expand your thoughts.",
      //   icon: <Sparkle className="w-7 text-black" />,
      //   command: () => {
      //     //
      //   },
      // },
      {
        title: "Heading 1",
        description: "Big section heading.",
        icon: <Heading1 size={18} />,
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
        title: "Heading 2",
        description: "Medium section heading.",
        icon: <Heading2 size={18} />,
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
        title: "Heading 3",
        description: "Small section heading.",
        icon: <Heading3 size={18} />,
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
        title: "Bullet List",
        description: "Create a bullet list.",
        icon: <List size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        description: "Create a numbered list.",
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Divider",
        description: "insert a dividing line",
        icon: <Divide size={24} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: "Quote",
        description: "Capture a quote.",
        icon: <TextQuote size={18} />,
        command: ({ editor, range }: Command) =>
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleNode("paragraph", "paragraph")
            .toggleBlockquote()
            .run(),
      },
      {
        title: "Code",
        description: "Capture a code snippet.",
        icon: <Code size={18} />,
        command: ({ editor, range }: Command) =>
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
      },
    ] as CommandItemProps[]
  ).filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      return item.title.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
};
