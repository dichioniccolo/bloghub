import { type FC } from "react";
import { useCompletion } from "ai/react/dist";
import { Sparkles } from "lucide-react";

import { BubbleMenu, type Editor } from "@acme/editor";

import { Icons } from "~/app/_components/icons";

type Props = {
  editor: Editor;
};

export const AIBubbleMenu: FC<Props> = ({ editor }) => {
  const { completion } = useCompletion({
    id: "editor-edit",
    api: "/api/generate",
  });

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        maxWidth: "100%",
        placement: "bottom",
        popperOptions: {
          strategy: "fixed",
        },
      }}
      className="mt-2 w-full overflow-hidden rounded border border-border bg-white shadow-xl animate-in fade-in slide-in-from-bottom-1"
    >
      <div className="p-4">
        {completion.length > 0 ? (
          completion
        ) : (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        )}
      </div>
      <div className="flex w-full items-center bg-stone-100 p-2">
        <div className="flex items-center space-x-1 text-stone-500">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-medium">AI is writing</p>
          <Icons.spinner className="h-4 w-4 animate-spin" />
        </div>
      </div>
    </BubbleMenu>
  );
};
