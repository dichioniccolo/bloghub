import type { ReactNode } from "react";
import { useEffect } from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import type { Editor } from "@tiptap/core";
import { isNodeSelection, posToDOMRect } from "@tiptap/core";

interface Props {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

// Adapted from https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146
export const ControlledBubbleMenu = ({
  editor,
  open,
  onOpenChange,
  children,
}: Props) => {
  const { state, view } = editor;
  const { selection } = state;

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange,
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    placement: "top",
    middleware: [
      offset({
        mainAxis: 8,
      }),
      flip({
        padding: 8,
        boundary: editor.options.element,
      }),
      shift(),
    ],
  });

  const focus = useFocus(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  useEffect(() => {
    const { ranges } = selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    refs.setReference({
      getBoundingClientRect() {
        if (isNodeSelection(selection)) {
          const node = view.nodeDOM(from) as HTMLElement;

          if (node) {
            return node.getBoundingClientRect();
          }
        }

        return posToDOMRect(view, from, to);
      },
    });
  }, [refs, selection, view]);

  const { getFloatingProps } = useInteractions([focus, click, dismiss, role]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      {...getFloatingProps()}
      className="container z-50"
    >
      {children}
    </div>
  );
};
