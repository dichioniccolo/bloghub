import { useCallback } from "react";
import type { Editor } from "@tiptap/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/components/ui/select";

const toolbarHeadings = [
  { value: "p", title: "Paragraph" },
  { value: "h1", title: "Heading 1" },
  { value: "h2", title: "Heading 2" },
  { value: "h3", title: "Heading 3" },
];

interface Props {
  editor: Editor;
}

export function ToolbarHeadings({ editor }: Props) {
  const onHeadingChange = useCallback(
    (value: string) => {
      if (!editor) {
        return;
      }

      switch (value) {
        case "p":
          editor.chain().focus().setParagraph().run();
          break;

        case "h1":
          editor.chain().focus().setHeading({ level: 1 }).run();
          break;

        case "h2":
          editor.chain().focus().setHeading({ level: 2 }).run();
          break;

        case "h3":
          editor.chain().focus().setHeading({ level: 3 }).run();
          break;
      }
    },
    [editor],
  );

  return (
    <Select
      value={getCurrentHeading(editor)}
      defaultValue={toolbarHeadings.at(0)?.value}
      onValueChange={onHeadingChange}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {toolbarHeadings.map((heading) => (
          <SelectItem key={heading.value} value={heading.value}>
            {heading.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    // <Select
    //   value={getCurrentHeading(editor)}
    //   initialValue={toolbarHeadings[0]?.value}
    //   items={toolbarHeadings}
    //   onChange={onHeadingChange}
    // />
  );
}

function getCurrentHeading(editor: Editor) {
  if (editor.isActive("heading", { level: 1 })) {
    return "h1";
  }

  if (editor.isActive("heading", { level: 2 })) {
    return "h2";
  }

  if (editor.isActive("heading", { level: 3 })) {
    return "h3";
  }

  return "p";
}
