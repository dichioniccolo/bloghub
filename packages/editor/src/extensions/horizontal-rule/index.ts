import { InputRule, mergeAttributes } from "@tiptap/core";
import TiptapHorizontalRule from "@tiptap/extension-horizontal-rule";

export const HorizontalRule = TiptapHorizontalRule.extend({
  addInputRules() {
    return [
      new InputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        handler: ({ state, range }) => {
          const attributes = {};

          const { tr } = state;
          const start = range.from;
          const end = range.to;

          tr.insert(start - 1, this.type.create(attributes)).delete(
            tr.mapping.map(start),
            tr.mapping.map(end),
          );
        },
      }),
    ];
  },
  renderHTML() {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, { "data-type": this.name }),
      ["hr"],
    ];
  },
}).configure({
  HTMLAttributes: {
    class: "mt-4 mb-6 border-t border-stone-300",
  },
});
