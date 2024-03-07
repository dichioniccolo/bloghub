// import { TableOfContentsNode } from "@/extensions/TableOfContentsNode";
import { isTextSelection } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

import {
  AiImage,
  AiWriter,
  CodeBlock,
  Figcaption,
  HorizontalRule,
  ImageBlock,
  ImageUpload,
  Link,
  ResizableMedia,
} from "../extensions";

export const getRenderContainer = (editor: Editor, nodeType: string) => {
  const {
    view,
    state: {
      selection: { from },
    },
  } = editor;

  const elements = document.querySelectorAll(".has-focus");
  const elementCount = elements.length;
  const innermostNode = elements[elementCount - 1];
  const element = innermostNode;

  if (
    element?.getAttribute("data-type") === nodeType ||
    element?.classList.contains(nodeType)
  ) {
    return element;
  }

  const node = view.domAtPos(from).node as HTMLElement;
  let container: HTMLElement | null = node;

  if (!container.tagName) {
    container = node.parentElement;
  }

  while (
    container &&
    !(
      container.getAttribute("data-type") &&
      container.getAttribute("data-type") === nodeType
    ) &&
    !container.classList.contains(nodeType)
  ) {
    container = container.parentElement;
  }

  return container;
};

export const isTableGripSelected = (node: HTMLElement) => {
  let container: HTMLElement | null = node;

  while (container && !["TD", "TH"].includes(container.tagName)) {
    container = container.parentElement!;
  }

  const gripColumn = container?.querySelector("a.grip-column.selected");
  const gripRow = container?.querySelector("a.grip-row.selected");

  if (!!gripColumn || !!gripRow) {
    return true;
  }

  return false;
};

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    ImageBlock.name,
    ImageUpload.name,
    CodeBlock.name,
    ImageBlock.name,
    Link.name,
    AiWriter.name,
    AiImage.name,
    Figcaption.name,
    ResizableMedia.name,
    // TableOfContentsNode.name,
  ];

  return (
    customNodes.some((type) => editor.isActive(type)) ||
    isTableGripSelected(node)
  );
};

export const isTextSelected = ({ editor }: { editor: Editor }) => {
  const {
    state: {
      doc,
      selection,
      selection: { empty, from, to },
    },
  } = editor;

  // Sometime check for `empty` is not enough.
  // Doubleclick an empty paragraph returns a node size of 2.
  // So we check also for an empty text size.
  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);

  if (empty || isEmptyTextBlock || !editor.isEditable) {
    return false;
  }

  return true;
};
