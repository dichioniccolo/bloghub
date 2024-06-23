import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";

import { Table } from "../..";
import { isTableSelected } from "../../utils";

export const isRowGripSelected = ({
  editor,
  view,
  state,
  from,
}: {
  editor: Editor;
  view: EditorView;
  state: EditorState;
  from: number;
}) => {
  const domAtPos = view.domAtPos(from).node as HTMLElement | undefined;
  const nodeDOM = view.nodeDOM(from) as HTMLElement | undefined;
  const node = nodeDOM ?? domAtPos;

  if (
    !editor.isActive(Table.name) ||
    !node ||
    isTableSelected(state.selection)
  ) {
    return false;
  }

  let container: HTMLElement | null = node;

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement;
  }

  const gripRow = container?.querySelector("a.grip-row.selected");

  return !!gripRow;
};
