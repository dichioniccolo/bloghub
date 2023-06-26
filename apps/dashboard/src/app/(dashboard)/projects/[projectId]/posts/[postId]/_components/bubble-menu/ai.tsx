import { BubbleMenu, type Editor } from "@bloghub/editor";
import { useCompletion } from "ai/react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Icons } from "~/app/_components/icons";

type Props = {
  editor: Editor;
};

export function AIBubbleMenu({ editor }: Props) {
  const { completion, isLoading } = useCompletion({
    id: "editor-edit",
    api: "/api/generate",
    onResponse(response) {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      } else if (response.status === 403) {
        toast.error("You are not allowed to use ai until you upgrade to pro.");
        return;
      }
    },
  });

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => {
        if (editor.isActive("resizableMedia") || editor.isActive("image")) {
          return false;
        }

        return editor.view.state.selection.content().size > 0;
      }}
      tippyOptions={{
        maxWidth: "100%",
        placement: "bottom",
        popperOptions: {
          strategy: "fixed",
        },
      }}
      className="mt-2 w-full min-w-[300px] overflow-hidden rounded border border-border bg-white shadow-xl animate-in fade-in slide-in-from-bottom-1"
    >
      <div className="p-4">
        {completion.length > 0 ? (
          completion
        ) : (
          <>
            <p className="text-sm font-medium text-stone-900">
              AI is writing...
            </p>
          </>
        )}
      </div>
      <div className="flex w-full items-center bg-stone-100 p-2">
        <div className="flex items-center space-x-1 text-stone-500">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-medium">AI is writing</p>
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
        </div>
      </div>
    </BubbleMenu>
  );
}
