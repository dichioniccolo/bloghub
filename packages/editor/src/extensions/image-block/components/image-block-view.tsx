import type { ElementRef } from "react";
import { useCallback, useRef } from "react";
import type { Node } from "@tiptap/pm/model";
import type { Editor } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";

import { cn } from "@acme/ui";

interface ImageBlockViewProps {
  editor: Editor;
  getPos: () => number;
  node: Node & {
    attrs: {
      src: string;
      align: "left" | "center" | "right";
      width: string;
      alt: string;
    };
  };
  updateAttributes: (attrs: Record<string, string>) => void;
}

export const ImageBlockView = ({
  editor,
  getPos,
  node,
}: ImageBlockViewProps) => {
  const imageWrapperRef = useRef<ElementRef<"div">>(null);

  const { src, alt, align, width } = node.attrs;

  const wrapperClassName = cn(
    align === "left" ? "ml-0" : "ml-auto",
    align === "right" ? "mr-0" : "mr-auto",
    align === "center" && "mx-auto",
  );

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
  }, [getPos, editor.commands]);

  return (
    <NodeViewWrapper>
      <div className={wrapperClassName} style={{ width }}>
        <div contentEditable={false} ref={imageWrapperRef}>
          <img className="block" src={src} alt={alt} onClick={onClick} />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
