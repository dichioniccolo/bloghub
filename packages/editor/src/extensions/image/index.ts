import { Image as BaseImage } from "@tiptap/extension-image";

export const Image = BaseImage.extend({
  group: "block",
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-lg border border-stone-200",
  },
});
