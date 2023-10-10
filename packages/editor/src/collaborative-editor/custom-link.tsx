import Link from "@tiptap/extension-link";

export const CustomLink = Link.configure({
  HTMLAttributes: {
    rel: "noopener noreferrer",
    class:
      "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
  },
});
