import type { ElementRef } from "react";
import { useCallback, useRef } from "react";
import { createId } from "@paralleldrive/cuid2";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import {
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalDistributeStart,
} from "lucide-react";
import type { Instance } from "tippy.js";
import { sticky } from "tippy.js";

import type { MenuProps } from "../../../components/menus/types";
import {
  ToolbarButton,
  ToolbarDivider,
  ToolbarWrapper,
} from "../../../components/ui/toolbar";
import { getRenderContainer } from "../../../lib/utils";
import { ImageBlockWidth } from "./image-block-width";

export { createId } from "@paralleldrive/cuid2";

export const ImageBlockMenu = ({ editor, appendTo }: MenuProps) => {
  const menuRef = useRef<ElementRef<"div">>(null);
  const tippyInstance = useRef<Instance | null>(null);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "node-imageBlock");

    const rect =
      renderContainer?.getBoundingClientRect() ??
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("imageBlock");

    return isActive;
  }, [editor]);

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("left")
      .run();
  }, [editor]);

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("center")
      .run();
  }, [editor]);

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("right")
      .run();
  }, [editor]);

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor],
  );

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${createId()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance) => {
          tippyInstance.current = instance;
        },
        appendTo: () => {
          return appendTo.current!;
        },
        plugins: [sticky],
        sticky: "popper",
      }}
    >
      <ToolbarWrapper shouldShowContent={shouldShow()} ref={menuRef}>
        <ToolbarButton
          tooltip="Align image left"
          active={editor.isActive("imageBlock", { align: "left" })}
          onClick={onAlignImageLeft}
        >
          <AlignHorizontalDistributeStart />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Align image center"
          active={editor.isActive("imageBlock", { align: "center" })}
          onClick={onAlignImageCenter}
        >
          <AlignHorizontalDistributeCenter />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Align image right"
          active={editor.isActive("imageBlock", { align: "right" })}
          onClick={onAlignImageRight}
        >
          <AlignHorizontalDistributeEnd />
        </ToolbarButton>
        <ToolbarDivider />
        <ImageBlockWidth
          onChange={onWidthChange}
          value={parseInt(editor.getAttributes("imageBlock").width)}
        />
      </ToolbarWrapper>
    </BaseBubbleMenu>
  );
};
