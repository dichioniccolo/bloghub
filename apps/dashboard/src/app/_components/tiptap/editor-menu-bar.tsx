import { type Editor } from "@tiptap/react";

import { cn } from "@acme/ui/src/lib";

import { Icons } from "../icons";

type Props = {
  editor: Editor | null;
};

export function EditorMenuBar({ editor }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded border px-4">
      <div className="-ml-2 flex gap-2 py-2">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded focus:border disabled:cursor-default disabled:opacity-50",
          )}
          title="Bold"
        >
          <Icons.bold className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
