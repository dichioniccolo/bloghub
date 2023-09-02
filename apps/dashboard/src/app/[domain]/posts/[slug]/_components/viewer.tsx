"use client";

import type { JSONContent } from "@tiptap/core";
import { Editor } from "novel";

interface Props {
  value: JSONContent;
}

export function Viewer({ value }: Props) {
  return (
    <div className="px-0 py-12">
      <Editor
        className="border-0 p-0"
        defaultValue={value}
        editorProps={{
          editable: () => false,
        }}
      />
    </div>
  );
}
