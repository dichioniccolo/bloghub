import { type Editor } from "@tiptap/core";

export type MediaNodeProps<TAttrs extends { id: string }> = {
  node: {
    attrs: TAttrs;
  };
  updateAttributes: (attrs: Partial<TAttrs>) => void;
  editor: Editor;
  deleteNode: () => void;
  selected: boolean;
};
