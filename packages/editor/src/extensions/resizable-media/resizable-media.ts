import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { RESIZABLE_MEDIA_NAME } from "@acme/lib/constants";

import type { UploadFunctionType } from "../image-upload/upload-image-plugin";
import { ResizableMediaNodeView } from "./resizable-media-node-view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableMedia: {
      /**
       * Set media
       */
      setMedia: (options: {
        "media-type": "img" | "video";
        src: string;
        alt?: string;
        title?: string;
        width?: string;
        height?: string;
      }) => ReturnType;
    };
  }
}

export const IMAGE_INPUT_REGEX =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export const VIDEO_INPUT_REGEX =
  /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export interface MediaOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const ResizableMedia = Node.create<MediaOptions>({
  name: RESIZABLE_MEDIA_NAME,

  addOptions() {
    return {
      HTMLAttributes: {},
      uploadFn: () => Promise.resolve(""),
    };
  },

  inline: false,

  group: "block",

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      "media-type": {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "auto",
      },
      dataAlign: {
        default: "left", // 'left' | 'center' | 'right'
      },
    };
  },

  selectable: true,

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
        getAttrs: (el) => ({
          src: (el as HTMLImageElement).getAttribute("src"),
          "media-type": "img",
        }),
      },
      // {
      //   tag: "video",
      //   getAttrs: (el) => ({
      //     src: (el as HTMLVideoElement).getAttribute("src"),
      //     ""media-type"": "video",
      //   }),
      // },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { mediaType: mediaType } = HTMLAttributes;

    if (mediaType === "img") {
      return [
        "img",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ];
    }

    // if (mediaType === "video") {
    //   return [
    //     "video",
    //     { controls: "true", style: "width: 100%", ...HTMLAttributes },
    //     ["source", HTMLAttributes],
    //   ];
    // }

    // if (!mediaType)
    //   console.error(
    //     "TiptapMediaExtension-renderHTML method: Media Type not set, going default with image",
    //   );

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setMedia:
        (options) =>
        ({ commands }) => {
          const { "media-type": mediaType } = options;

          if (mediaType === "img") {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          }
          // if (mediaType === "video") {
          //   return commands.insertContent({
          //     type: this.name,
          //     attrs: {
          //       ...options,
          //       controls: "true",
          //     },
          //   });
          // }

          // if (!mediaType)
          //   console.error(
          //     "TiptapMediaExtension-setMedia: Media Type not set, going default with image",
          //   );

          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableMediaNodeView);
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: IMAGE_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;

          return {
            src,
            alt,
            title,
            mediaType: "img",
          };
        },
      }),
      // nodeInputRule({
      //   find: VIDEO_INPUT_REGEX,
      //   type: this.type,
      //   getAttributes: (match) => {
      //     const [, , src] = match;

      //     return {
      //       src,
      //       "mediaType": "video",
      //     };
      //   },
      // }),
    ];
  },
});

export interface MediaWithUploaderOptions {
  uploadFn: UploadFunctionType;
}

// export const ResizableMediaWithUploader =
//   ResizableMedia.extend<MediaWithUploaderOptions>({
//     addProseMirrorPlugins() {
//       return [UploadImagesPlugin(this.options.uploadFn)];
//     },
//   });
