import { createId } from "@paralleldrive/cuid2";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { AiContentView } from "./components/ai-content-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiContent: {
      setAiContent: (content: string) => ReturnType;
      setAiContentAt: (options: {
        from: number;
        to: number;
        content: string;
      }) => ReturnType;
    };
  }
}

export const AiContent = Node.create({
  name: "aiContent",

  group: "block",

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: `node-${this.name}`,
      },
    };
  },

  addAttributes() {
    return {
      id: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `div.node-${this.name}`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setAiContent:
        (content) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: {
                id: createId(),
              },
            })
            .run(),

      setAiContentAt:
        ({ from, to, content }) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContentAt(
              { from, to },
              {
                type: this.name,
                attrs: {
                  id: createId(),
                },
                text: content,
              },
            )
            .run(),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiContentView);
  },
});
