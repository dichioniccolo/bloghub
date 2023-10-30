import type { Editor } from "@tiptap/react";

import { ToolbarAlignment } from "./toolbar-alignment";
import { ToolbarBlock } from "./toolbar-block";
import { ToolbarCommands } from "./toolbar-commands";
import { ToolbarHeadings } from "./toolbar-headings";
import { ToolbarInline } from "./toolbar-inline";
import { ToolbarInlineAdvanced } from "./toolbar-inline-advanced";
import { ToolbarMedia } from "./toolbar-media";

interface Props {
  editor: Editor;
}

export function Toolbar({ editor }: Props) {
  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center gap-2">
        <ToolbarCommands editor={editor} />
        <div className="mx-2 my-0 h-10 w-px bg-border"></div>
        <ToolbarHeadings editor={editor} />
        <div className="mx-2 my-0 h-10 w-px bg-border"></div>
        <ToolbarInline editor={editor} />
        <div className="mx-2 my-0 h-10 w-px bg-border"></div>
        <ToolbarInlineAdvanced editor={editor} />
      </div>
      <div className="flex items-center gap-2">
        <ToolbarAlignment editor={editor} />
        <div className="mx-2 my-0 h-10 w-px bg-border"></div>
        <ToolbarBlock editor={editor} />
        <div className="mx-2 my-0 h-10 w-px bg-border"></div>
        <ToolbarMedia editor={editor} />
      </div>
    </div>
  );
}
