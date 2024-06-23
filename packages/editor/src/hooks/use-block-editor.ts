import { useMemo } from "react";
import type { Content, Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";

import { useDebouncedCallback } from "@acme/ui/hooks/use-debounced-callback";

import type { EditorUser } from "../components/block-editor/types";
import { ExtensionKit } from "../extensions/extension-kit";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

interface Options {
  editable?: boolean;
  initialContent?: Content;
  onDebouncedUpdate?(content: Content): void;
  onUpload: (file: File) => Promise<string>;
}

export const useBlockEditor = ({
  editable = true,
  initialContent,
  onDebouncedUpdate,
  onUpload,
}: Options) => {
  const debouncedUpdates = useDebouncedCallback((content: Content) => {
    onDebouncedUpdate?.(content);
  }, 750);

  const editor = useEditor(
    {
      editable,
      content: initialContent,
      autofocus: editable ? "end" : null,
      onCreate: () => {
        //
      },
      onUpdate: ({ editor }) => {
        debouncedUpdates(editor.getJSON());
      },
      extensions: [
        ...ExtensionKit({
          onUpload,
          openLinkOnClick: false,
        }),
      ],
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class:
            "min-h-full prose-lg prose-headings:font-display focus:outline-none",
        },
      },
    },
    [],
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const users: EditorUser[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!editor?.storage.collaborationCursor?.users) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
      const names = user.name.split(" ");
      const firstName = names[0];
      const lastName = names[names.length - 1];
      const initials = `${firstName?.[0] ?? "?"}${lastName?.[0] ?? "?"}`;

      return { ...user, initials: initials.length ? initials : "?" };
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  }, [editor?.storage.collaborationCursor?.users]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const characterCount = editor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  window.editor = editor;

  return {
    editor,
    users,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    characterCount,
  };
};
