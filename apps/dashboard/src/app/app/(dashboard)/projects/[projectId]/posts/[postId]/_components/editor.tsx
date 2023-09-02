import type { JSONContent } from "@tiptap/core";
import { Editor as NovelEditor } from "novel";

interface Props {
  value: string;
  onChange?(value: JSONContent): void;
  projectId: string;
  postId: string;
}

export function Editor({ value, onChange, projectId, postId }: Props) {
  // const { complete, completion, isLoading, stop } = useCompletion({
  //   id: "editor",
  //   api: "/api/generate",
  //   onFinish: (_prompt, completion) => {
  //     editor?.commands.setTextSelection({
  //       from: editor.state.selection.from - completion.length,
  //       to: editor.state.selection.from,
  //     });
  //   },
  //   onError: (err) => {
  //     toast.error(err.message);
  //   },
  // });

  // const onUpdate = useCallback(
  //   ({ editor }: { editor: EditorType }) => {
  //     const selection = editor.state.selection;

  //     const lastTwo = getPrevText(editor, {
  //       chars: 2,
  //     });

  //     if (lastTwo === "++" && !isLoading) {
  //       editor.commands.deleteRange({
  //         from: selection.from - 2,
  //         to: selection.from,
  //       });
  //       void complete(
  //         getPrevText(editor, {
  //           chars: 5000,
  //         }),
  //       );
  //     } else {
  //       onChange?.(editor.getJSON());
  //     }
  //   },
  //   [complete, isLoading, onChange],
  // );

  // const uploadFile = useCallback(
  //   async (file: File) => {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("type", determineMediaType(file)?.toString() ?? "");
  //     formData.append("projectId", projectId);
  //     formData.append("postId", postId);
  //     formData.append("forEntity", "1"); // MediaForEntity.PostContent

  //     const media = await createProjectMedia(formData);

  //     return media.url;
  //   },
  //   [postId, projectId],
  // );

  // const editor = useEditor({
  //   extensions: [...TiptapExtensions],
  //   content: value,
  //   onUpdate,
  //   autofocus: "end",
  // });

  // const prev = useRef("");

  // // Insert chunks of the generated text
  // useEffect(() => {
  //   const diff = completion.slice(prev.current.length);
  //   prev.current = completion;
  //   editor?.commands.insertContent(diff, {
  //     parseOptions: {
  //       preserveWhitespace: "full",
  //     },
  //   });
  // }, [isLoading, editor, completion]);

  // useEffect(() => {
  //   // if user presses escape or cmd + z and it's loading,
  //   // stop the request, delete the completion, and insert back the "++"
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
  //       stop();
  //       if (e.key === "Escape") {
  //         editor?.commands.deleteRange({
  //           from: editor.state.selection.from - completion.length,
  //           to: editor.state.selection.from,
  //         });
  //       }
  //       editor?.commands.insertContent("++");
  //     }
  //   };

  //   const mouseDownHandler = (e: MouseEvent) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     stop();

  //     if (window.confirm("AI writing paused. Continue?")) {
  //       void complete(
  //         getPrevText(editor!, {
  //           chars: 5000,
  //           offset: 0,
  //         }),
  //       );
  //     }
  //   };

  //   if (isLoading) {
  //     document.addEventListener("keydown", onKeyDown);
  //     document.addEventListener("mousedown", mouseDownHandler);
  //   }

  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown);
  //     document.removeEventListener("mousedown", mouseDownHandler);
  //   };
  // }, [stop, isLoading, editor, completion.length, complete]);

  return (
    <div className="pb-12 sm:mb-[20vh]">
      <NovelEditor
        className="border-0 p-0"
        defaultValue={value}
        editorProps={{}}
        onUpdate={(editor) => {
          if (!editor) {
            return;
          }
          onChange?.(editor.getJSON());
        }}
      />
    </div>
  );

  // if (!editor) {
  //   return (
  //     <div className="flex h-full min-h-[500px] w-full items-center justify-center">
  //       <Loader2 className="h-6 w-6 animate-spin" />
  //     </div>
  //   );
  // }

  // return (
  //   <div
  //     // onClick={() => {
  //     //   editor.chain().focus().run();
  //     // }}
  //     className="relative min-h-[500px] w-full bg-background pb-12 sm:mb-[calc(20vh)]"
  //   >
  //     <EditorContent editor={editor} />
  //     <EditorBubbleMenu editor={editor} />
  //     {/* <AIBubbleMenu editor={editor} /> */}
  //     {editor.isActive("table") && <TableMenu editor={editor} />}
  //   </div>
  // );
}
