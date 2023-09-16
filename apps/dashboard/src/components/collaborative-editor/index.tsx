import LiveblocksProvider from "@liveblocks/yjs";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import type { Content, Extensions } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";

import "highlight.js/styles/github-dark.css";

import { useEffect, useRef, useState } from "react";
import { useCompletion } from "ai/react";
import { useRoom, useSelf } from "liveblocks.config";
import { toast } from "sonner";
import * as Y from "yjs";

import { useDebouncedCallback } from "~/hooks/use-debounced-callback";
import { TiptapEditorProps } from "~/lib/editor/props";
import { Avatars } from "../liveblocks/avatars";
import { CustomBubbleMenu } from "./bubble-menu";
import { AiBubbleMenuProvider } from "./bubble-menu/ai/ai-bubble-menu-context";
import { AiFixGrammarAndSpellCheckBubbleMenu } from "./bubble-menu/ai/ai-fix-grammar-and-spell-check-bubble-menu";
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

  const { completion, isLoading } = useCompletion({
    id: "completion",
    api: "/api/generate",
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const debouncedUpdates = useDebouncedCallback(() => {
    onDebouncedUpdate?.();
  }, 750);

  const editor = useEditor({
    editorProps: TiptapEditorProps,
    extensions: [
      ...EditorExtensions({
        openLinkOnClick: true,
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
    <div className="relative flex h-full w-full flex-col pb-20">
      <div className="flex items-center justify-between border-b border-border">
        {editor && <WordCount editor={editor} />}
        <Avatars />
      </div>
      {editor && (
        <AiBubbleMenuProvider>
          <CustomBubbleMenu editor={editor} />
          <AiFixGrammarAndSpellCheckBubbleMenu editor={editor} />
        </AiBubbleMenuProvider>
      )}
      <EditorContent editor={editor} className="relative h-full" />
    </div>
  );
}
