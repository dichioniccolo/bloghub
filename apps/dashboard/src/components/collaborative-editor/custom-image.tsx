import Image from "@tiptap/extension-image";

export const CustomImage = Image.configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-lg border border-stone-200",
  },
});
