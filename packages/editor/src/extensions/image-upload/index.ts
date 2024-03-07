import { Node, ReactNodeViewRenderer } from "@tiptap/react";

import { ImageUpload as ImageUploadComponent } from "./components/image-upload";
import { UploadImagesPlugin } from "./upload-image-plugin";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: () => ReturnType;
    };
  }
}

export interface ImageUploadOptions {
  HTMLAttributes: Record<string, unknown>;
  onUpload: (file: File) => Promise<string>;
}

export const ImageUpload = Node.create<ImageUploadOptions>({
  name: "imageUpload",

  isolating: true,

  defining: true,

  group: "block",

  draggable: true,

  selectable: true,

  inline: false,

  addOptions() {
    return {
      HTMLAttributes: {},
      onUpload: (_file: File) => Promise.resolve(""),
    };
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML() {
    return ["div", { "data-type": this.name }];
  },

  addCommands() {
    return {
      setImageUpload:
        () =>
        ({ commands }) =>
          commands.insertContent(`<div data-type="${this.name}"></div>`),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent(this.options.onUpload));
  },

  addProseMirrorPlugins() {
    return [UploadImagesPlugin(this.options.onUpload)];
  },
});
