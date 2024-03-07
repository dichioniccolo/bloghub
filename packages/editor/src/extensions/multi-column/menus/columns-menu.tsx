import { useCallback } from "react";
import { createId } from "@paralleldrive/cuid2";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import { Columns, PanelLeft, PanelRight } from "lucide-react";
import { sticky } from "tippy.js";

import type { MenuProps } from "../../../components/menus/types";
import { ToolbarButton, ToolbarWrapper } from "../../../components/ui/toolbar";
import { getRenderContainer } from "../../../lib/utils";
import { ColumnLayout } from "../columns";

export const ColumnsMenu = ({ editor, appendTo }: MenuProps) => {
  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "columns");
    const rect =
      renderContainer?.getBoundingClientRect() ??
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isColumns = editor.isActive("columns");
    return isColumns;
  }, [editor]);

  const onColumnLeft = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarLeft).run();
  }, [editor]);

  const onColumnRight = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarRight).run();
  }, [editor]);

  const onColumnTwo = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.TwoColumn).run();
  }, [editor]);

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`columnsMenu-${createId()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        appendTo: () => appendTo.current!,
        plugins: [sticky],
        sticky: "popper",
      }}
    >
      <ToolbarWrapper>
        <ToolbarButton
          tooltip="Sidebar left"
          active={editor.isActive("columns", {
            layout: ColumnLayout.SidebarLeft,
          })}
          onClick={onColumnLeft}
        >
          <PanelLeft />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Two columns"
          active={editor.isActive("columns", {
            layout: ColumnLayout.TwoColumn,
          })}
          onClick={onColumnTwo}
        >
          <Columns />
        </ToolbarButton>
        <ToolbarButton
          tooltip="Sidebar right"
          active={editor.isActive("columns", {
            layout: ColumnLayout.SidebarRight,
          })}
          onClick={onColumnRight}
        >
          <PanelRight />
        </ToolbarButton>
      </ToolbarWrapper>
    </BaseBubbleMenu>
  );
};
