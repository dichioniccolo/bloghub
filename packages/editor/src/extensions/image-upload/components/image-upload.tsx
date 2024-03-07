import { useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";

import { ImageUploader } from "./image-uploader";

export const ImageUpload = (onUpload: (file: File) => Promise<string>) =>
  function ImageUpload({
    getPos,
    editor,
  }: {
    getPos: () => number;
    editor: Editor;
  }) {
    const onUploadComplete = useCallback(
      (url: string) => {
        if (url) {
          editor
            .chain()
            .setImageBlock({ src: url })
            .deleteRange({ from: getPos(), to: getPos() })
            .focus()
            .run();
        }
      },
      [getPos, editor],
    );

    return (
      <NodeViewWrapper>
        <div className="m-0 p-0" data-drag-handle>
          <ImageUploader
            onUpload={onUpload}
            onUploadComplete={onUploadComplete}
          />
        </div>
      </NodeViewWrapper>
    );
  };
