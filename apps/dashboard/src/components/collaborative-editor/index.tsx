import LiveblocksProvider from "@liveblocks/yjs";
import { CharacterCount } from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import type { Extensions } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "highlight.js/styles/github-dark.css";

import { useEffect, useState } from "react";
import { useRoom, useSelf } from "liveblocks.config";
import * as Y from "yjs";

import { useEditor } from "~/hooks/use-editor";
import { Avatars } from "../liveblocks/avatars";
import { CustomBubbleMenu } from "./bubble-menu/custom-bubble-menu";
import { CustomCodeBlock } from "./custom-codeblock";
import { CustomDragAndDrop } from "./custom-drag-and-drop";
import { CustomHorizontalRule } from "./custom-horizontal-rule";
import { CustomImage } from "./custom-image";
import { CustomKeymap } from "./custom-keymap";
import { CustomLink } from "./custom-link";
import { CustomTaskItem, CustomTaskList } from "./custom-task-item";
import { CustomTextAlign } from "./custom-text-align";
import { WordCount } from "./word-count";

interface Props {
  initialContent?: unknown;
  extensions?: Extensions;
}

export function CollaborativeEditor({ initialContent, extensions }: Props) {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<unknown>();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  return (
    <TiptapEditor
      doc={doc}
      provider={provider}
      initialContent={initialContent}
      extensions={extensions}
    />
  );
}

interface EditorProps {
  doc: Y.Doc;
  provider: unknown;
  initialContent?: unknown;
  extensions?: Extensions;
}

function TiptapEditor({
  doc,
  provider,
  initialContent,
  extensions,
}: EditorProps) {
  const userInfo = useSelf((me) => me.info);

  const editor = useEditor({
    extensions: [
      ...(extensions ?? []),
      StarterKit.configure({
        history: false,
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside leading-3 -mt-2",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside leading-3 -mt-2",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "leading-normal -mb-2",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-stone-700",
          },
        },
        codeBlock: false,
        code: {
          HTMLAttributes: {
            class:
              "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-black",
            spellcheck: "false",
          },
        },
        horizontalRule: false,
        dropcursor: {
          color: "#DBEAFE",
          width: 4,
        },
      }),
      CustomHorizontalRule,
      CharacterCount,
      CustomTaskList,
      CustomTaskItem,
      CustomKeymap,
      CustomLink.configure({
        openOnClick: false,
      }),
      CustomImage,
      CustomTextAlign,
      CustomDragAndDrop,
      CustomCodeBlock,
      Underline,
      TextStyle,
      Color,
      Subscript,
      Superscript,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: () => {
          return "Press '/' for commands...";
        },
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider,
        user: userInfo,
      }),
    ],
    autofocus: "end",
  });

  useEffect(() => {
    if (initialContent) {
      editor?.commands.setContent(initialContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col rounded-md pb-20">
      <div className="flex items-center justify-between border-b border-border">
        {editor && <WordCount editor={editor} />}
        <Avatars />
      </div>
      {editor && <CustomBubbleMenu editor={editor} />}
      <EditorContent editor={editor} className="relative h-full" />
    </div>
  );
}
