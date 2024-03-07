"use client";

import type { ElementRef } from "react";
import { useRef } from "react";
import type { Content, PureEditorContent } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

import { ImageBlockMenu } from "../../extensions/image-block/components/image-block-menu";
import { ColumnsMenu } from "../../extensions/multi-column/menus";
import { TableColumnMenu, TableRowMenu } from "../../extensions/table/menus";
import { useBlockEditor } from "../../hooks/use-block-editor";
import { LinkMenu } from "../menus/link-menu";
import { TextMenu } from "../menus/text-menu";

interface Props {
  initialContent?: Content;
  onDebouncedUpdate?(content: Content): void;
  onUpload: (file: File) => Promise<string>;
}

export const BlockEditor = ({
  initialContent,
  onDebouncedUpdate,
  onUpload,
}: Props) => {
  const menuContainerRef = useRef<ElementRef<"div">>(null);
  const editorRef = useRef<PureEditorContent | null>(null);

  const { editor } = useBlockEditor({
    initialContent,
    onDebouncedUpdate,
    onUpload,
  });

  // const displayedUsers = users.slice(0, 3);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex" ref={menuContainerRef}>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* <div className="flex items-center justify-between border-b border-border">
          {editor && <WordCount editor={editor} />}
        </div> */}
        <EditorContent
          editor={editor}
          // @ts-expect-error dunno
          ref={editorRef}
          className="max-h-[550px] flex-1 overflow-y-auto"
        />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};
