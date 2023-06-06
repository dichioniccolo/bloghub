import { Node, nodeInputRule } from "@tiptap/core";

import { dropVideoPlugin } from "./drop-video-plugin";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: {
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
 * ![Lorem](video.mov) -> [, "Lorem", "video.mov"]
 * ![](video.mov "Ipsum") -> [, "", "video.mov", "Ipsum"]
 * ![Lorem](video.mov "Ipsum") -> [, "Lorem", "video.mov", "Ipsum"]
 */
const VIDEO_INPUT_REGEX =
  /!\[(.*?)\]\((\S+\.(?:mp4|avi|mov|mkv|wmv))(?:\s+"(.*?)")?\)/;

export const VideoExtension = (
  userId: string,
  projectId: string,
  postId: string,
) => {
  return Node.create({
    name: "video",
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
        tag: "video[src]",
        getAttrs: (dom) => {
          if (typeof dom === "string") return {};

          const element = dom as HTMLVideoElement;

          return {
            src: element.getAttribute("src"),
            title: element.getAttribute("title"),
            alt: element.getAttribute("alt"),
          };
        },
      },
    ],
    renderHTML: ({ HTMLAttributes }) => [
      "video",
      {
        controls: true,
        ...HTMLAttributes,
      },
      ["source", HTMLAttributes],
    ],
    addCommands() {
      return {
        setVideo:
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
          find: VIDEO_INPUT_REGEX,
          type: this.type,
          getAttributes: (match) => {
            const [, alt, src, title] = match;
            return {
              src,
              alt,
              title,
            };
          },
        }),
      ];
    },
    addProseMirrorPlugins() {
      return [dropVideoPlugin(userId, projectId, postId)];
    },
  });
};
