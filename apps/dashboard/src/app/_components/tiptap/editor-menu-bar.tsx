"use client";

import { type ReactNode } from "react";
import { type Editor } from "@tiptap/react";

import { cn } from "@acme/ui/src/lib";

import { Icons } from "../icons";

type ToolbarGroup = {
  items: ToolbarItem[];
};

type ToolbarItem = {
  title: string;
  icon: ReactNode;
  onClick(): void;
  isActive?: boolean;
};

type ToolbarItems = (ToolbarGroup | ToolbarItem)[];

const TOOLBAR_ITEMS = (editor: Editor) =>
  [
    {
      items: [
        {
          title: "Bold",
          icon: <Icons.bold className="h-5 w-5" />,
          onClick: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive("bold"),
        },
      ],
    },
  ] as ToolbarItems;

type Props = {
  editor: Editor | null;
};

export function EditorMenuBar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded border px-4">
      <div className="-ml-2 flex gap-2 py-2">
        {TOOLBAR_ITEMS(editor).map((item, index) => {
          if ("items" in item) {
            return <ToolbarGroup key={index} items={item.items} />;
          }

          return <ToolbarItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
}

function ToolbarGroup({ items }: { items: ToolbarItem[] }) {
  return (
    <div className="flex divide-x divide-border rounded-sm">
      {items.map((item, index) => (
        <ToolbarItem key={index} item={item} />
      ))}
    </div>
  );
}

function ToolbarItem({
  item: { icon, isActive, ...item },
}: {
  item: ToolbarItem;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded focus:border disabled:cursor-default disabled:opacity-50",
        isActive ? "bg-background/60" : "bg-transparent",
      )}
      {...item}
    >
      {icon}
    </button>
  );
}
