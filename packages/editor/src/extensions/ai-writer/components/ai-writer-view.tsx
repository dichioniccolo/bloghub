import { useCallback, useMemo, useState } from "react";
import { createId } from "@paralleldrive/cuid2";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { NodeViewWrapperProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { toast } from "sonner";

import { Button } from "@acme/ui/components/ui/button";
import { Textarea } from "@acme/ui/components/ui/textarea";

import { DropdownButton } from "../../../components/ui/dropdown-button";
import { Icon } from "../../../components/ui/icon";
import { Panel, PanelHeadline } from "../../../components/ui/panel";
import { Surface } from "../../../components/ui/surface";
import { ToolbarDivider } from "../../../components/ui/toolbar";
import type { AiTone } from "../../../lib/constants";
import { tones } from "../../../lib/constants";
import { useEditorCompletion } from "../hooks/use-ai-completion";

export interface DataProps {
  text: string;
  addHeading: boolean;
  tone?: string;
  textUnit?: string;
  textLength?: string;
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
    onResponse: () => {},
    onFinish: () => {},
  });

  const [data, setData] = useState<DataProps>({
    text: "",
    tone: undefined,
    textLength: undefined,
    addHeading: false,
    language: undefined,
  });
  const currentTone = tones.find((t) => t.value === data.tone);
  const textareaId = useMemo(() => createId(), []);

  const generateText = useCallback(async () => {
    const {
      text: dataText,
      tone,
      textLength,
      textUnit,
      addHeading,
      language,
    } = data;

    if (!data.text) {
      toast.error("Please enter a description");

      return;
    }

    const payload = {
      text: dataText,
      textLength: textLength,
      textUnit: textUnit,
      useHeading: addHeading,
      tone,
      language,
    };

    try {
      await complete(dataText);
      // const response = await fetch(`${baseUrl}/text/prompt`, {
      //   method: 'POST',
      //   headers: {
      //     accept: 'application.json',
      //     'Content-Type': 'application/json',
      //     'X-App-Id': appId.trim(),
      //     Authorization: `Bearer ${token.trim()}`,
      //   },
      //   body: JSON.stringify(payload),
      // })

      // const json = await response.json()
      // const text = json.response

      // if (!text.length) {
      //   setIsFetching(false)

      //   return
      // }

      // setPreviewText(text)
    } catch {
      toast.error("An error occurred");
    }
  }, [complete, data]);

  const insert = useCallback(() => {
    const from = getPos();
    const to = from + node.nodeSize;

    editor.chain().focus().insertContentAt({ from, to }, completion).run();
  }, [editor, completion, getPos, node.nodeSize]);

  const discard = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const onTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setData((prevData) => ({ ...prevData, text: e.target.value }));
    },
    [],
  );

  const onUndoClick = useCallback(() => {
    setData((prevData) => ({ ...prevData, tone: undefined }));
  }, []);

  const createItemClickHandler = useCallback((tone: AiTone) => {
    return () => {
      setData((prevData) => ({ ...prevData, tone: tone.value }));
    };
  }, []);

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full">
        <div className="flex flex-col p-1">
          {completion && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div
                className="relative mb-4 ml-2.5 max-h-[14rem] overflow-y-auto border-l-4 border-neutral-100 bg-white px-4 text-base text-black dark:border-neutral-700 dark:bg-black dark:text-white"
                dangerouslySetInnerHTML={{ __html: completion }}
              />
            </>
          )}
          <div className="flex flex-row items-center justify-between gap-1">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            id={textareaId}
            value={data.text}
            onChange={onTextAreaChange}
            placeholder={"Tell me what you want me to write about."}
            required
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex w-auto justify-between gap-1">
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button>
                    <Icon name="Mic" />
                    {currentTone?.label ?? "Change tone"}
                    <Icon name="ChevronDown" />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Portal>
                  <Dropdown.Content side="bottom" align="start" asChild>
                    <Surface className="min-w-[12rem] p-2">
                      {!!data.tone && (
                        <>
                          <Dropdown.Item asChild>
                            <DropdownButton
                              isActive={data.tone === undefined}
                              onClick={onUndoClick}
                            >
                              <Icon name="Undo2" />
                              Reset
                            </DropdownButton>
                          </Dropdown.Item>
                          <ToolbarDivider horizontal />
                        </>
                      )}
                      {tones.map((tone) => (
                        <Dropdown.Item asChild key={tone.value}>
                          <DropdownButton
                            isActive={tone.value === data.tone}
                            onClick={createItemClickHandler(tone)}
                          >
                            {tone.label}
                          </DropdownButton>
                        </Dropdown.Item>
                      ))}
                    </Surface>
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            </div>
            <div className="flex w-auto justify-between gap-1">
              {completion && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={discard}
                >
                  <Icon name="Trash" />
                  Discard
                </Button>
              )}
              {completion && (
                <Button variant="ghost" onClick={insert} disabled={!completion}>
                  <Icon name="Check" />
                  Insert
                </Button>
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
