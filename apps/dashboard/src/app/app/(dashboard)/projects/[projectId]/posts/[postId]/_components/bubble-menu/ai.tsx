import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react";
import { useCompletion } from "ai/react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Props = {
  editor: Editor;
};

export function AIBubbleMenu({ editor }: Props) {
  const { completion, isLoading } = useCompletion({
    id: "editor-edit",
    api: "/api/generate",
    onError: (error) => {
      toast.error(error.message);
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
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>
    </BubbleMenu>
  );
}
