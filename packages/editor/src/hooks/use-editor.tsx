import type * as React from "react";
import type { EditorOptions } from "@tiptap/core";
import { useEditor as useBaseEditor } from "@tiptap/react";

import { TiptapEditorProps } from "../props";

type Options = Omit<Partial<EditorOptions>, "editorProps">;

export function useEditor(
  { ...options }: Options,
  deps?: React.DependencyList,
) {
  return useBaseEditor(
    {
      ...options,
      editorProps: TiptapEditorProps,
    },
    deps,
  );
}
