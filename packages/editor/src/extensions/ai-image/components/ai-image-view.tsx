import { useCallback, useMemo, useState } from "react";
import { createId } from "@paralleldrive/cuid2";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { NodeViewWrapperProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@acme/ui/components/ui/button";
import { Textarea } from "@acme/ui/components/ui/textarea";

import { DropdownButton } from "../../../components/ui/dropdown-button";
import { Icon } from "../../../components/ui/icon";
import { Panel, PanelHeadline } from "../../../components/ui/panel";
import { Surface } from "../../../components/ui/surface";
import { ToolbarDivider } from "../../../components/ui/toolbar";

const imageStyles = [
  { name: "photorealistic", label: "Photorealistic", value: "photorealistic" },
  { name: "digital-art", label: "Digital art", value: "digital_art" },
  { name: "comic-book", label: "Comic book", value: "comic_book" },
  { name: "neon-punk", label: "Neon punk", value: "neon_punk" },
  { name: "isometric", label: "Isometric", value: "isometric" },
  { name: "line-art", label: "Line art", value: "line_art" },
  { name: "3d-model", label: "3D model", value: "3d_model" },
];

type ImageStyle = (typeof imageStyles)[number]["name"];

interface Data {
  text: string;
  imageStyle?: ImageStyle;
}

export const AiImageView = ({
  editor,
  node,
  getPos,
  deleteNode,
}: NodeViewWrapperProps) => {
  const [data, setData] = useState<Data>({
    text: "",
    imageStyle: undefined,
  });
  const currentImageStyle = imageStyles.find(
    (t) => t.value === data.imageStyle,
  );
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    undefined,
  );
  const [isFetching, setIsFetching] = useState(false);
  const textareaId = useMemo(() => createId(), []);

  const generateImage = useCallback(async () => {
    if (!data.text) {
      toast.error("Please enter a description for the image");

      return;
    }

    setIsFetching(true);

    const payload = {
      text: data.text,
      style: data.imageStyle,
    };

    try {
      // const { baseUrl, appId, token } = aiOptions;
      // const response = await fetch(`${baseUrl}/image/prompt`, {
      //   method: "POST",
      //   headers: {
      //     accept: "application.json",
      //     "Content-Type": "application/json",
      //     "X-App-Id": appId.trim(),
      //     Authorization: `Bearer ${token.trim()}`,
      //   },
      //   body: JSON.stringify(payload),
      // });

      // const json = await response.json();
      // const url = json.response;

      // if (!url.length) {
      //   return;
      // }

      // setPreviewImage(url);

      setIsFetching(false);
    } catch {
      setIsFetching(false);
      toast.error("An error occurred");
    }
  }, [data]);

  const insert = useCallback(() => {
    if (!previewImage?.length) {
      return;
    }

    editor
      .chain()
      .insertContent(`<img src="${previewImage}" alt="" />`)
      .deleteRange({ from: getPos(), to: getPos() })
      .focus()
      .run();

    setIsFetching(false);
  }, [editor, previewImage, getPos]);

  const discard = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setData((prevData) => ({ ...prevData, text: e.target.value })),
    [],
  );

  const onUndoClick = useCallback(() => {
    setData((prevData) => ({ ...prevData, imageStyle: undefined }));
    setPreviewImage(undefined);
  }, []);

  const createItemClickHandler = useCallback(
    (style: { name: string; label: string; value: string }) => {
      return () =>
        setData((prevData) => ({
          ...prevData,
          imageStyle: style.value,
        }));
    },
    [],
  );

  const editable = editor.options.editable;

  if (!editable) {
    return null;
  }

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full">
        <div className="flex flex-col p-1">
          {isFetching && <Loader2 className="size-4 animate-spin" />}
          {previewImage && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div
                className="mb-4 aspect-square w-full rounded border border-black bg-white bg-contain bg-center bg-no-repeat dark:border-neutral-700"
                style={{ backgroundImage: `url(${previewImage})` }}
              />
            </>
          )}
          <div className="row flex items-center justify-between gap-2">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <Textarea
            id={textareaId}
            value={data.text}
            onChange={handleTextareaChange}
            placeholder={`Describe the image that you want me to generate.`}
            required
            className="mb-2"
          />
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex w-auto justify-between gap-1">
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button>
                    <Icon name="Image" />
                    {currentImageStyle?.label ?? "Image style"}
                    <Icon name="ChevronDown" />
                  </Button>
                </Dropdown.Trigger>
                <Dropdown.Portal>
                  <Dropdown.Content side="bottom" align="start" asChild>
                    <Surface className="min-w-[12rem] p-2">
                      {!!data.imageStyle && (
                        <>
                          <DropdownButton
                            isActive={data.imageStyle === undefined}
                            onClick={onUndoClick}
                          >
                            <Icon name="Undo2" />
                            Reset
                          </DropdownButton>
                          <ToolbarDivider horizontal />
                        </>
                      )}
                      {imageStyles.map((style) => (
                        <DropdownButton
                          isActive={style.value === data.imageStyle}
                          key={style.value}
                          onClick={createItemClickHandler(style)}
                        >
                          {style.label}
                        </DropdownButton>
                      ))}
                    </Surface>
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            </div>
            <div className="flex flex-row items-center justify-between gap-1">
              {previewImage && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  onClick={discard}
                >
                  <Icon name="Trash" />
                  Discard
                </Button>
              )}
              {previewImage && (
                <Button variant="ghost" onClick={insert}>
                  <Icon name="Check" />
                  Insert
                </Button>
              )}
              <Button onClick={generateImage}>
                {previewImage ? (
                  <Icon name="Repeat" />
                ) : (
                  <Icon name="Sparkles" />
                )}
                {previewImage ? "Regenerate" : "Generate image"}
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </NodeViewWrapper>
  );
};
