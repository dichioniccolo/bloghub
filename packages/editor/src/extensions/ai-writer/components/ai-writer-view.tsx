import type { ElementRef } from "react";
import { useCallback, useMemo, useRef } from "react";
import { createId } from "@paralleldrive/cuid2";
import type { NodeViewWrapperProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { toast } from "sonner";

import { Button } from "@acme/ui/components/ui/button";
import { Textarea } from "@acme/ui/components/ui/textarea";

import { Icon } from "../../../components/ui/icon";
import { Panel, PanelHeadline } from "../../../components/ui/panel";
import { useEditorCompletion } from "../hooks/use-ai-completion";

export interface DataProps {
  text: string;
  tone?: string;
  language?: string;
}

export const AiWriterView = ({
  editor,
  node,
  getPos,
  deleteNode,
}: NodeViewWrapperProps) => {
  const { complete, completion } = useEditorCompletion({
    body: {
      type: "completion",
    },
  });

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const textareaId = useMemo(() => createId(), []);

  const generateText = useCallback(async () => {
    if (!textareaRef.current?.value) {
      toast.error("Please enter a description");

      return;
    }

    try {
      await complete(textareaRef.current.value);
      textareaRef.current.value = "";
    } catch {
      toast.error("An error occurred");
    }
  }, [complete]);

  const insert = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const from = getPos();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const to = from + node.nodeSize;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    editor.chain().focus().insertContentAt({ from, to }, completion).run();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  }, [completion, editor, getPos, node.nodeSize]);

  const discard = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    deleteNode();
  }, [deleteNode]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const editable = editor.options.editable;

  if (!editable) {
    return null;
  }

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full">
        <div className="flex flex-col p-1">
          {completion && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div className="relative mb-4 ml-2.5 max-h-[14rem] overflow-y-auto border-l-4 border-neutral-100 bg-white px-4 text-base text-black dark:border-neutral-700 dark:bg-black dark:text-white">
                {completion}
              </div>
            </>
          )}
          <div className="flex flex-row items-center justify-between gap-1">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            ref={textareaRef}
            id={textareaId}
            placeholder={"Tell me what you want me to write about."}
            required
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-end gap-1">
            <div className="flex w-auto justify-between gap-1">
              {completion && (
                <>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    onClick={discard}
                  >
                    <Icon name="Trash" />
                    Discard
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={insert}
                    disabled={!completion}
                  >
                    <Icon name="Check" />
                    Insert
                  </Button>
                </>
              )}
              <Button onClick={generateText} style={{ whiteSpace: "nowrap" }}>
                {completion ? <Icon name="Repeat" /> : <Icon name="Sparkles" />}
                {completion ? "Regenerate" : "Generate text"}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  );
};
