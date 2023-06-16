// "use client";

// import { type ReactNode } from "react";
// import { type Editor } from "@tiptap/react";

// type ToolbarGroup = {
//   items: ToolbarItem[];
// };

// type ToolbarItem = {
//   title: string;
//   icon: ReactNode;
//   onClick(): void;
//   isActive?: boolean;
// };

// type ToolbarItems = (ToolbarGroup | ToolbarItem)[];

// const TOOLBAR_ITEMS = (editor: Editor) =>
//   [
//     {
//       items: [
//         {
//           title: "Bold",
//           icon: <Icons.bold className="h-5 w-5" />,
//           onClick: () => editor.chain().focus().toggleBold().run(),
//           isActive: editor.isActive("bold"),
//         },
//         {
//           title: "Italic",
//           icon: <Icons.italic className="h-5 w-5" />,
//           onClick: () => editor.chain().focus().toggleItalic().run(),
//           isActive: editor.isActive("italic"),
//         },
//         {
//           title: "Strike",
//           icon: <Icons.strikeThrough className="h-5 w-5" />,
//           onClick: () => editor.chain().focus().toggleStrike().run(),
//           isActive: editor.isActive("strike"),
//         },
//       ],
//     },
//     {
//       items: [
//         {
//           title: "Heading 1",
//           icon: <Icons.h1 className="h-5 w-5" />,
//           onClick: () =>
//             editor.chain().focus().toggleHeading({ level: 1 }).run(),
//           isActive: editor.isActive("heading", { level: 1 }),
//         },
//         {
//           title: "Heading 2",
//           icon: <Icons.h2 className="h-5 w-5" />,
//           onClick: () =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run(),
//           isActive: editor.isActive("heading", { level: 2 }),
//         },
//         {
//           title: "Heading 3",
//           icon: <Icons.h3 className="h-5 w-5" />,
//           onClick: () =>
//             editor.chain().focus().toggleHeading({ level: 3 }).run(),
//           isActive: editor.isActive("heading", { level: 3 }),
//         },
//         {
//           title: "Heading 4",
//           icon: <Icons.h4 className="h-5 w-5" />,
//           onClick: () =>
//             editor.chain().focus().toggleHeading({ level: 4 }).run(),
//           isActive: editor.isActive("heading", { level: 4 }),
//         },
//         {
//           title: "Paragraph",
//           icon: <Icons.paragraph className="h-5 w-5" />,
//           onClick: () => editor.chain().focus().setParagraph().run(),
//           isActive: editor.isActive("paragraph"),
//         },
//       ],
//     },
//     {
//       items: [
//         {
//           title: "Bullet List",
//           icon: <Icons.list className="h-5 w-5" />,
//           onClick: () => editor.chain().focus().toggleBulletList().run(),
//           isActive: editor.isActive("bulletList"),
//         },
//         {
//           title: "Ordered List",
//           icon: <Icons.listOrdered className="h-5 w-5" />,
//           onClick: () => editor.chain().focus().toggleOrderedList().run(),
//           isActive: editor.isActive("orderedList"),
//         },
//       ],
//     },
//     {
//       items: [
//         {
//           title: "Image",
//           icon: <Icons.image className="h-5 w-5" />,
//           onClick: () =>
//             editor
//               .chain()
//               .focus()
//               .setImage({
//                 src: "",
//               })
//               .run(),
//         },
//       ],
//     },
//   ] as ToolbarItems;

// type Props = {
//   editor: Editor | null;
// };

// export function EditorMenuBar({ editor }: Props) {
//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="sticky top-0 flex items-center justify-between gap-4 rounded border px-4">
//       <div className="-ml-2 flex gap-2 py-2">
//         {TOOLBAR_ITEMS(editor).map((item, index) => {
//           if ("items" in item) {
//             return <ToolbarGroup key={index} items={item.items} />;
//           }

//           return <ToolbarItem key={index} item={item} />;
//         })}
//       </div>
//     </div>
//   );
// }

// function ToolbarGroup({ items }: { items: ToolbarItem[] }) {
//   return (
//     <div className="flex divide-x divide-border overflow-hidden rounded-sm border">
//       {items.map((item, index) => (
//         <ToolbarItem key={index} item={item} />
//       ))}
//     </div>
//   );
// }

// function ToolbarItem({
//   item: { icon, isActive, ...item },
// }: {
//   item: ToolbarItem;
// }) {
//   return (
//     <button
//       type="button"
//       className={cn(
//         "inline-flex h-8 w-8 items-center justify-center disabled:cursor-default disabled:opacity-50",
//         isActive ? "bg-primary/10" : "bg-transparent",
//       )}
//       {...item}
//     >
//       {icon}
//     </button>
//   );
// }
