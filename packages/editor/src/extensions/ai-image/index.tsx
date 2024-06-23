import { createId } from "@paralleldrive/cuid2";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { AiImageView } from "./components/ai-image-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    aiImage: {
      setAiImage: () => ReturnType;
    };
  }
}

export const AiImage = Node.create({
  name: "aiImage",

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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setAiImage:
        () =>
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
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(AiImageView);
  },
});

export default AiImage;
