import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import { CustomCodeBlock } from "./custom-codeblock";
import { CustomHorizontalRule } from "./custom-horizontal-rule";
import { CustomImage } from "./custom-image";
import { CustomKeymap } from "./custom-keymap";
import { CustomLink } from "./custom-link";
import { CustomSmileReplacer } from "./custom-smile-replacer";
import { CustomTaskItem, CustomTaskList } from "./custom-task-item";
import { CustomTextAlign } from "./custom-text-align";

interface Options {
  openLinkOnClick: boolean;
}

export const EditorExtensions = (options: Options) => [
  StarterKit.configure({
    history: false,
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 -mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 -mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-stone-700",
      },
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black",
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
  }),
  CustomHorizontalRule,
  CharacterCount,
  CustomTaskList,
  CustomTaskItem,
  CustomKeymap,
  CustomLink.configure({
    openOnClick: options.openLinkOnClick,
  }),
  CustomImage,
  CustomTextAlign,
  // CustomDragAndDrop,
  CustomCodeBlock,
  CustomSmileReplacer,
  Underline,
  TextStyle,
  Color,
  Subscript,
  Superscript,
  Highlight.configure({
    multicolor: true,
  }),
];
