import React, { useEffect, useState } from "react";
import type { BubbleMenuPluginProps } from "@tiptap/extension-bubble-menu";
import { useCurrentEditor } from "@tiptap/react";

import { BubbleMenuPlugin } from "./bubble-menu-plugin";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type BubbleMenuProps = Omit<
  Optional<BubbleMenuPluginProps, "pluginKey" | "editor">,
  "element"
> & {
  className?: string;
  children: React.ReactNode;
  updateDelay?: number;
};

export const BubbleMenuView = (props: BubbleMenuProps) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const { editor: currentEditor } = useCurrentEditor();

  useEffect(() => {
    if (!element) {
      return;
    }

    if (!!props.editor?.isDestroyed || currentEditor?.isDestroyed) {
      return;
    }

    const {
      pluginKey = "bubbleMenu",
      editor,
      tippyOptions = {},
      updateDelay,
      shouldShow = null,
    } = props;

    const menuEditor = editor ?? currentEditor;

    if (!menuEditor) {
      console.warn(
        "BubbleMenu component is not rendered inside of an editor component or does not have editor prop.",
      );
      return;
    }

    const plugin = BubbleMenuPlugin({
      updateDelay,
      editor: menuEditor,
      element,
      pluginKey,
      shouldShow,
      tippyOptions,
    });

    menuEditor.registerPlugin(plugin);
    return () => menuEditor.unregisterPlugin(pluginKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editor, currentEditor, element]);

  return (
    <div
      ref={setElement}
      className={props.className}
      style={{ visibility: "hidden" }}
    >
      {props.children}
    </div>
  );
};
