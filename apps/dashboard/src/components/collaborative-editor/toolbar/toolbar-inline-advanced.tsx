import type { Editor } from "@tiptap/react";
import { Code, Highlighter } from "lucide-react";

import { Button } from "@acme/ui/components/button";

interface Props {
  editor: Editor;
}

export function ToolbarInlineAdvanced({ editor }: Props) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleCode().run()}
        disabled={!editor.can().chain().toggleCode().run()}
      >
        <Code className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().toggleHighlight().run()}
        disabled={!editor.can().chain().toggleHighlight().run()}
      >
        <Highlighter className="h-5 w-5" />
      </Button>
      {/* <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={!editor.can().chain().setLink({ href: "" }).run()}
          >
            <Link className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <LinkPopover
            onSubmit={(link) =>
              editor.chain().focus().toggleLink({ href: link }).run()
            }
            onRemoveLink={(link) =>
              editor.chain().focus().toggleLink({ href: link }).run()
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            showRemove={editor.getAttributes("link").href}
          />
        </PopoverContent>
      </Popover> */}
    </>
  );
}
