import { mergeAttributes, Node } from "@tiptap/core";

export const Quote = Node.create({
  name: "quote",

  content: "paragraph+",

  defining: true,

  marks: "",

  parseHTML() {
    return [
      {
        tag: "blockquote",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, this.options.HTMLAttributes),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => false,
    };
  },
});
