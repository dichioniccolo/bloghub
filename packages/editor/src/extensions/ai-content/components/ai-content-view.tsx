import type { NodeViewWrapperProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";

export const AiContentView = ({ node }: NodeViewWrapperProps) => {
  return <NodeViewWrapper data-drag-handle>{node.text}</NodeViewWrapper>;
};
