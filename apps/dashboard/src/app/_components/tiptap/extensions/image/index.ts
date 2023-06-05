import { Node, nodeInputRule } from "@tiptap/core";

import { dropImagePlugin } from "./drop-image-plugin";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const IMAGE_INPUT_REGEX =
  /!\[(.*?)\]\((\S+\.(?:png|jpe?g|gif|bmp|ico|webp))(?:\s+"(.*?)")?\)/;

export const createImageExtension = (
  userId: string,
  projectId: string,
  postId: string,
) => {
  return Node.create({
    name: "image",
    group: "block",
    content: "block*",
    atom: true,
    isolating: true,
    draggable: true,
    addAttributes: () => ({
      src: {},
      alt: { default: null },
      title: { default: null },
    }),
    parseHTML: () => [
      {
        tag: "img[src]",
        getAttrs: (dom) => {
          if (typeof dom === "string") return {};

          const element = dom as HTMLImageElement;

          return {
            src: element.getAttribute("src"),
            title: element.getAttribute("title"),
            alt: element.getAttribute("alt"),
          };
        },
      },
    ],
    renderHTML: ({ HTMLAttributes }) => ["img", HTMLAttributes],
    addCommands() {
      return {
        setImage:
          (attrs) =>
          ({ state, dispatch }) => {
            const { selection } = state;
            const position = selection.$head
              ? selection.$head.pos
              : selection.$to.pos;

            const node = this.type.create(attrs);
            const transaction = state.tr.insert(position, node);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return dispatch?.(transaction);
          },
      };
    },
    addInputRules() {
      return [
        nodeInputRule({
          find: IMAGE_INPUT_REGEX,
          type: this.type,
          getAttributes: (match) => {
            const [, alt, src, title] = match;
            return { src, alt, title };
          },
        }),
      ];
    },
    addProseMirrorPlugins() {
      return [dropImagePlugin(userId, projectId, postId)];
    },
  });
};
