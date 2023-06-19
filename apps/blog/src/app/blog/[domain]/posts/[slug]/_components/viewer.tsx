import {
  ColorHighlighter,
  EditorContent,
  HorizontalRuleExtension,
  ImageExtension,
  Placeholder,
  SlashCommand,
  SmileReplacer,
  StarterKit,
  TiptapLink,
  useEditor,
  Youtube,
} from "@acme/editor";

import { Icons } from "~/app/_components/icons";

type Props = {
  value: string;
};

export function Viewer({ value }: Props) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      ColorHighlighter,
      HorizontalRuleExtension,
      ImageExtension,
      Placeholder,
      SlashCommand,
      SmileReplacer,
      TiptapLink,
      Youtube,
    ],
    content: value,
  });

  if (!editor) {
    return (
      <div className="flex h-full min-h-[500px] w-full items-center justify-center">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[500px] w-full px-0 py-12 sm:mb-[20vh]">
      <EditorContent editor={editor} />
    </div>
  );
}
