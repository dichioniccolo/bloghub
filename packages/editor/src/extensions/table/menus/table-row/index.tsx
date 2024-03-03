import React, { useCallback } from "react";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";
import { ArrowDownToLine, ArrowUpToLine, Trash } from "lucide-react";

import type {
  MenuProps,
  ShouldShowProps,
} from "../../../../components/menus/types";
import * as PopoverMenu from "../../../../components/ui/popover-menu";
import { ToolbarWrapper } from "../../../../components/ui/toolbar";
import { isRowGripSelected } from "./utils";

export const TableRowMenu = React.memo(
  ({ editor, appendTo }: MenuProps): JSX.Element => {
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state || !from) {
          return false;
        }

        return isRowGripSelected({ editor, view, state, from });
      },
      [editor],
    );

    const onAddRowBefore = useCallback(() => {
      editor.chain().focus().addRowBefore().run();
    }, [editor]);

    const onAddRowAfter = useCallback(() => {
      editor.chain().focus().addRowAfter().run();
    }, [editor]);

    const onDeleteRow = useCallback(() => {
      editor.chain().focus().deleteRow().run();
    }, [editor]);

    return (
      <BaseBubbleMenu
        editor={editor}
        pluginKey="tableRowMenu"
        updateDelay={0}
        tippyOptions={{
          appendTo: () => {
            return appendTo.current!;
          },
          placement: "left",
          offset: [0, 15],
          popperOptions: {
            modifiers: [{ name: "flip", enabled: false }],
          },
        }}
        shouldShow={shouldShow}
      >
        <ToolbarWrapper isVertical>
          <PopoverMenu.Item
            iconComponent={<ArrowUpToLine />}
            close={false}
            label="Add row before"
            onClick={onAddRowBefore}
          />
          <PopoverMenu.Item
            iconComponent={<ArrowDownToLine />}
            close={false}
            label="Add row after"
            onClick={onAddRowAfter}
          />
          <PopoverMenu.Item
            iconComponent={<Trash />}
            close={false}
            label="Delete row"
            onClick={onDeleteRow}
          />
        </ToolbarWrapper>
      </BaseBubbleMenu>
    );
  },
);

TableRowMenu.displayName = "TableRowMenu";
