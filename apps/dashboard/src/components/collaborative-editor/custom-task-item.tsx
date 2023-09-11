/* eslint-disable jsx-a11y/label-has-associated-control */
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import type { NodeViewProps } from "@tiptap/react";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

import { Checkbox } from "../ui/checkbox";

export const CustomTaskList = TaskList.configure({
  HTMLAttributes: {
    class: "not-prose pl-2",
  },
});

// A custom task item that uses the checkbox primitive
export const CustomTaskItem = TaskItem.extend({
  addNodeView: () => {
    return ReactNodeViewRenderer(TiptapCheckbox);
  },
}).configure({
  nested: true,
});

function TiptapCheckbox({ editor, node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className="my-2 ml-8 mr-0 flex">
      <label
        className="my-0 ml-0 mr-6 flex-[0_0_auto] select-none pt-px"
        contentEditable={false}
      >
        <Checkbox
          disabled={!editor.isEditable}
          defaultChecked={false}
          className="rounded-sm [--radius:0.5rem]"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          checked={node.attrs.checked}
          onCheckedChange={(checked) =>
            updateAttributes({
              checked,
            })
          }
        />
      </label>
      <NodeViewContent className="flex-auto" />
    </NodeViewWrapper>
  );
}
