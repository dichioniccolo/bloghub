import Focus from "@tiptap/extension-focus";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";

import { ColorHighlighter } from "./color-highlighter";
import { SlashCommand } from "./commands";
import { HorizontalRuleExtension } from "./horizontal-rule";
import { ImageExtension } from "./media/image";
import { SmilieReplacer } from "./smile-replacer";

export const TiptapExtensions = (
  userId?: string,
  projectId?: string,
  postId?: string,
) => [
  StarterKit.configure({
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
        class: "border-l-4 border-gray-300 pl-4",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "rounded-md bg-gray-200 p-5 font-mono font-medium text-gray-800",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black",
      },
    },
  }),
  HorizontalRuleExtension.configure({
    HTMLAttributes: {
      class: "my-4 border-t border-border",
    },
  }),
  Focus,
  ColorHighlighter,
  SmilieReplacer,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }
      // return "Press '/' for commands, or '++' for AI autocomplete...";
      return "Press '/' for commands...";
    },
    includeChildren: true,
  }),
  ImageExtension(userId, projectId, postId),
  // VideoExtension(userId, projectId, postId),
  SlashCommand,
  Youtube,
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
    },
  }),
];
