import LiveblocksProvider from "@liveblocks/yjs";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import type { Content, Extensions } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";

import "highlight.js/styles/github-dark.css";

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";

import { useDebouncedCallback } from "@acme/ui/hooks/use-debounced-callback";

import { TiptapEditorProps } from "../lib/props";
import { useRoom, useSelf } from "../liveblocks.config";
import { Avatars } from "../liveblocks/avatars";
import { CustomBubbleMenu } from "./bubble-menu";
import { AiFixGrammarAndSpellCheckBubbleMenu } from "./bubble-menu/ai/ai-fix-grammar-and-spell-check-bubble-menu";
import { AiSummarizeBubbleMenu } from "./bubble-menu/ai/ai-summarize-bubble-menu";
import { useAiCompletion } from "./bubble-menu/ai/use-ai-completion";
import { BubbleMenuProvider } from "./bubble-menu/bubble-menu-context";
import { EditorExtensions } from "./extensions";
import { WordCount } from "./word-count";

interface Props {
  initialContent?: unknown;
  extensions?: Extensions;
  onDebouncedUpdate?(): void;
}

export function CollaborativeEditor({
  initialContent,
  extensions,
  onDebouncedUpdate,
}: Props) {
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
      onDebouncedUpdate={onDebouncedUpdate}
    />
  );
}

interface EditorProps {
  doc: Y.Doc;
  provider: unknown;
  initialContent?: unknown;
  extensions?: Extensions;
  onDebouncedUpdate?(): void;
}

function TiptapEditor({
  doc,
  provider,
  initialContent,
  extensions: customExtensions,
  onDebouncedUpdate,
}: EditorProps) {
  const userInfo = useSelf((me) => me.info);

  const { completion, isLoading } = useAiCompletion({
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
  });

  const debouncedUpdates = useDebouncedCallback(() => {
    onDebouncedUpdate?.();
  }, 750);

  const editor = useEditor({
    editorProps: TiptapEditorProps,
    extensions: [
      ...EditorExtensions({
        openLinkOnClick: false,
      }),
      ...(customExtensions ?? []),
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
    content: initialContent as Content | undefined,
    autofocus: "end",
    onUpdate: () => {
      debouncedUpdates();
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff, {
      parseOptions: {
        preserveWhitespace: "full",
      },
    });
  }, [isLoading, editor, completion]);

  return (
    <div className="relative flex h-full w-full flex-col pb-96">
      <div className="flex items-center justify-between border-b border-border">
        {editor && <WordCount editor={editor} />}
        <Avatars />
      </div>
      {editor && (
        <BubbleMenuProvider>
          <CustomBubbleMenu editor={editor} />
          <AiFixGrammarAndSpellCheckBubbleMenu editor={editor} />
          <AiSummarizeBubbleMenu editor={editor} />
        </BubbleMenuProvider>
      )}
      <EditorContent editor={editor} className="relative h-full" />
    </div>
  );
}
