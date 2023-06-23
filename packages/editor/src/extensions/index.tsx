import { Color } from "@tiptap/extension-color";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";

import { ColorHighlighter } from "./color-highlighter";
import { SlashCommand } from "./commands";
import { HorizontalRuleExtension } from "./horizontal-rule";
import { ResizableMedia } from "./resizable-media";
import { SmileReplacer } from "./smile-replacer";

const StarterKitX = StarterKit.configure({
  horizontalRule: false,
  heading: {
    levels: [1, 2, 3],
  },
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  bulletList: {
    HTMLAttributes: {
      class: "list-disc list-outside leading-3",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal list-outside leading-3",
    },
  },
  listItem: {
    HTMLAttributes: {
      class: "leading-normal",
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: "border-l-4 border-stone-700",
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: "rounded-sm bg-stone-100 p-5 font-mono font-medium text-gray-800",
    },
  },
  code: {
    HTMLAttributes: {
      class:
        "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black",
    },
  },
  gapcursor: false,
});

const HorizontalRuleExtensionX = HorizontalRuleExtension.configure({
  HTMLAttributes: {
    class: "my-4 border-t border-border",
  },
});

const PlaceholderX = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs.level}`;
    }

    return "Press '/' for commands, or '++' for AI autocomplete...";
  },
  includeChildren: true,
});

const TiptapLinkX = TiptapLink.configure({
  HTMLAttributes: {
    class:
      "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
  },
});

const TaskListX = TaskList.configure({
  HTMLAttributes: {
    class: "not-prose pl-2",
  },
});

const TaskItemX = TaskItem.configure({
  HTMLAttributes: {
    class: "flex items-start mb-4",
  },
});

const YoutubeX = Youtube.configure({});

export {
  Color,
  ColorHighlighter,
  HorizontalRuleExtensionX as HorizontalRuleExtension,
  PlaceholderX as Placeholder,
  ResizableMedia,
  SlashCommand,
  SmileReplacer,
  StarterKitX as StarterKit,
  TaskItemX as TaskItem,
  TaskListX as TaskList,
  TextStyle,
  TiptapLinkX as TiptapLink,
  Underline,
  YoutubeX as Youtube,
};
