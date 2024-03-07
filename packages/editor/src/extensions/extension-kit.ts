import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";

import "highlight.js/styles/github-dark.css";

import {
  AiContent,
  AiImage,
  AiWriter,
  BlockquoteFigure,
  CharacterCount,
  Color,
  Column,
  Columns,
  Document,
  Dropcursor,
  Figcaption,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  ImageUpload,
  Keymap,
  Link,
  Placeholder,
  ResizableMedia,
  Selection,
  SlashCommand,
  SmileReplacer,
  StarterKit,
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TaskItem,
  TaskList,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
} from ".";

const lowlight = createLowlight();

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("csharp", csharp);

interface ExtensionKitProps {
  openLinkOnClick: boolean;
  onUpload: (file: File) => Promise<string>;
  // userId: string;
  // userName: string;
  // userColor: string;
}

export const ExtensionKit = ({
  openLinkOnClick,
  onUpload,
}: ExtensionKitProps) => [
  Document,
  Columns,
  TaskList,
  TaskItem,
  AiWriter,
  AiImage,
  AiContent,
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    // blockquote: {
    // HTMLAttributes: {
    //   class: "border-l-4 border-stone-700",
    // },
    // },
    codeBlock: false,
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
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black",
        spellcheck: "false",
      },
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: null,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: openLinkOnClick,
    HTMLAttributes: {
      rel: "noopener noreferrer",
      class:
        "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
    },
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Underline,
  CharacterCount,
  ImageUpload.configure({
    onUpload,
  }),
  ImageBlock,
  // FileHandler
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {};
    },
  }).configure({
    types: ["heading", "paragraph"],
  }),
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => "",
  }),
  SlashCommand,
  Focus,
  Figcaption,
  BlockquoteFigure,
  Dropcursor.configure({
    width: 4,
    class: "ProseMirror-dropcursor border-black",
  }),
  // CUSTOM
  SmileReplacer,
  Keymap,
  ResizableMedia,
];
