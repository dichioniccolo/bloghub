import { useMemo, useState } from "react";
import type { Editor } from "@tiptap/core";
import type { BubbleMenuProps } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

import { cn } from "~/lib/cn";
import { ColorSelector } from "./color-selector";
import { LinkSelector } from "./link-selector";
import { NodeSelector } from "./node-selector";
import { TextAlighSelector } from "./text-align-selector";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children" | "editor"> & {
  editor: Editor;
};

export function EditorBubbleMenu({ editor, ...props }: EditorBubbleMenuProps) {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => editor.isActive("bold"),
      command: () => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => editor.isActive("italic"),
      command: () => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: () => editor.isActive("underline"),
      command: () => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: () => editor.isActive("strike"),
      command: () => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: () => editor.isActive("code"),
      command: () => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  const shouldMenuShow = useMemo(() => {
    return !editor.isActive("resizableMedia") && !editor.isActive("image");
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    editor,
    shouldShow: ({ editor }) => {
      if (!shouldMenuShow) {
        return false;
      }

      return editor.view.state.selection.content().size > 0;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        // setIsAISelectorOpen(false);
        setIsNodeSelectorOpen(false);
        setIsTextAlighSelectorOpen(false);
        setIsLinkSelectorOpen(false);
        setIsColorSelectorOpen(false);
      },
    },
  };

  // const [_isAISelectorOpen, setIsAISelectorOpen] = useState(false);
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isTextAlighSelectorOpen, setIsTextAlighSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);

  const isCodeActive = editor.isActive("code");
  const isCodeBlockAcive = editor.isActive("codeBlock");

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex w-fit max-w-[97vw] divide-x overflow-x-auto rounded border bg-background shadow-xl"
    >
      {/* <AISelector
        editor={editor}
        isOpen={isAISelectorOpen}
        setIsOpen={() => {
          setIsAISelectorOpen(!isAISelectorOpen);
          setIsNodeSelectorOpen(false)
          setIsTextAlighSelectorOpen(false);
          setIsLinkSelectorOpen(false);
          setIsColorSelectorOpen(false);
        }}
      /> */}
      <NodeSelector
        editor={editor}
        isOpen={isNodeSelectorOpen}
        setIsOpen={() => {
          // setIsAISelectorOpen(false);
          setIsNodeSelectorOpen(!isNodeSelectorOpen);
          setIsTextAlighSelectorOpen(false);
          setIsLinkSelectorOpen(false);
          setIsColorSelectorOpen(false);
        }}
      />

      {!isCodeActive && !isCodeBlockAcive && (
        <>
          <TextAlighSelector
            editor={editor}
            isOpen={isTextAlighSelectorOpen}
            setIsOpen={() => {
              // setIsAISelectorOpen(false);
              setIsNodeSelectorOpen(false);
              setIsTextAlighSelectorOpen(!isTextAlighSelectorOpen);
              setIsLinkSelectorOpen(false);
              setIsColorSelectorOpen(false);
            }}
          />

          <LinkSelector
            editor={editor}
            isOpen={isLinkSelectorOpen}
            setIsOpen={() => {
              // setIsAISelectorOpen(false);
              setIsNodeSelectorOpen(false);
              setIsTextAlighSelectorOpen(false);
              setIsLinkSelectorOpen(!isLinkSelectorOpen);
              setIsColorSelectorOpen(false);
            }}
          />
          <div className="flex">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={item.command}
                className="p-2 hover:bg-muted active:bg-muted"
              >
                <item.icon
                  className={cn("h-4 w-4", {
                    "text-blue-500": item.isActive(),
                  })}
                />
              </button>
            ))}
          </div>
          <ColorSelector
            editor={editor}
            isOpen={isColorSelectorOpen}
            setIsOpen={() => {
              // setIsAISelectorOpen(false);
              setIsNodeSelectorOpen(false);
              setIsTextAlighSelectorOpen(false);
              setIsLinkSelectorOpen(false);
              setIsColorSelectorOpen(!isColorSelectorOpen);
            }}
          />
        </>
      )}
    </BubbleMenu>
  );
}
