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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
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
