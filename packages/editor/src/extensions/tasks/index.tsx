/* eslint-disable jsx-a11y/label-has-associated-control */
import TiptapTaskItem from "@tiptap/extension-task-item";
import TiptapTaskList from "@tiptap/extension-task-list";
import type { NodeViewProps } from "@tiptap/react";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

import { Checkbox } from "@acme/ui/components/ui/checkbox";

export const TaskList = TiptapTaskList.configure({
  HTMLAttributes: {
    class: "not-prose pl-2",
  },
});

// A custom task item that uses the checkbox primitive
export const TaskItem = TiptapTaskItem.extend({
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
