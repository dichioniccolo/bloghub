import * as React from "react";
import type { Editor, Range } from "@tiptap/core";
import {
  CheckSquare,
  Code,
  Divide,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Sparkles,
  Text,
  TextQuote,
} from "lucide-react";

type Command = {
  editor: Editor;
  range: Range;
};

export type CommandItemProps = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: React.ReactNode;
  command: (command: Command) => unknown;
};

export const getSuggestionItems = ({ query }: { query: string }) => {
  return (
    [
      {
        title: "Continue writing",
        description: "Use AI to expand your thoughts.",
        searchTerms: ["gpt"],
        icon: <Sparkles className="w-7" />,
        command: () => {
          //
        },
      },
      {
        title: "Text",
        description: "Just start typing with plain text.",
        searchTerms: ["p", "paragraph"],
        icon: <Text size={18} />,
        command: ({ editor, range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleNode("paragraph", "paragraph")
            .run();
        },
      },
      {
        title: "To-do List",
        description: "Track tasks with a to-do list.",
        searchTerms: ["todo", "task", "list", "check", "checkbox"],
        icon: <CheckSquare size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        title: "Heading 1",
        description: "Big section heading.",
        searchTerms: ["title", "big", "large"],
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
        searchTerms: ["subtitle", "medium"],
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
        searchTerms: ["subtitle", "small"],
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
        searchTerms: ["unordered", "point"],
        icon: <List size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: "Numbered List",
        description: "Create a numbered list.",
        searchTerms: ["ordered"],
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: "Divider",
        description: "insert a dividing line",
        searchTerms: ["divide", "split"],
        icon: <Divide size={24} />,
        command: ({ editor, range }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: "Quote",
        description: "Capture a quote.",
        searchTerms: ["blockquote"],
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
        searchTerms: ["codeblock"],
        icon: <Code size={18} />,
        command: ({ editor, range }: Command) =>
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
      },
      // {
      //   title: "Table",
      //   description: "Add a table view to organize data.",
      //   searchTerms: ["table"],
      //   icon: <Table size={18} />,
      //   command: ({ editor, range }: Command) => {
      //     editor
      //       .chain()
      //       .focus()
      //       .deleteRange(range)
      //       .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      //       .run();
      //   },
      // },
    ] satisfies CommandItemProps[]
  ).filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};
