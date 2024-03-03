// import Placeholder from "@tiptap/extension-placeholder";
// import type { Content, Extensions } from "@tiptap/react";
// import { EditorContent, useEditor } from "@tiptap/react";

// import "highlight.js/styles/github-dark.css";

// import { useEffect, useRef } from "react";

// import { useDebouncedCallback } from "@acme/ui/hooks/use-debounced-callback";

// import { WordCount } from "../components/word-count";
// import { TiptapEditorProps } from "../lib/props";
// import { CustomBubbleMenu } from "./bubble-menu";
// import { AiFixGrammarAndSpellCheckBubbleMenu } from "./bubble-menu/ai/ai-fix-grammar-and-spell-check-bubble-menu";
// import { AiSummarizeBubbleMenu } from "./bubble-menu/ai/ai-summarize-bubble-menu";
// import { useAiCompletion } from "./bubble-menu/ai/use-ai-completion";
// import { BubbleMenuProvider } from "./bubble-menu/bubble-menu-context";

// interface EditorProps {
//   initialContent?: unknown;
//   extensions?: Extensions;
//   onDebouncedUpdate?(content: Content): void;
// }

// export function TiptapEditor({
//   initialContent,
//   extensions: customExtensions,
//   onDebouncedUpdate,
// }: EditorProps) {
//   const { completion, isLoading } = useAiCompletion({
//     onFinish: (_prompt, completion) => {
//       editor?.commands.setTextSelection({
//         from: editor.state.selection.from - completion.length,
//         to: editor.state.selection.from,
//       });
//     },
//   });

//   const debouncedUpdates = useDebouncedCallback((content: Content) => {
//     onDebouncedUpdate?.(content);
//   }, 750);

//   const editor = useEditor({
//     editorProps: TiptapEditorProps,
//     extensions: [
//       ...EditorExtensions({
//         openLinkOnClick: false,
//       }),
//       ...(customExtensions ?? []),
//       Placeholder.configure({
//         placeholder: () => {
//           return "Press '/' for commands...";
//         },
//       }),
//       // Collaboration.configure({
//       //   document: doc,
//       // }),
//       // CollaborationCursor.configure({
//       //   provider,
//       //   user: userInfo,
//       // }),
//     ],
//     content: initialContent as Content | undefined,
//     autofocus: "end",
//     onUpdate: ({ editor }) => {
//       debouncedUpdates(editor.getJSON());
//     },
//   });

//   const prev = useRef("");

//   // Insert chunks of the generated text
//   useEffect(() => {
//     const diff = completion.slice(prev.current.length);
//     prev.current = completion;
//     editor?.commands.insertContent(diff, {
//       parseOptions: {
//         preserveWhitespace: "full",
//       },
//     });
//   }, [isLoading, editor, completion]);

//   return (
//     <div className="relative flex h-full w-full flex-col pb-96">
//       <div className="flex items-center justify-between border-b border-border">
//         {editor && <WordCount editor={editor} />}
//         {/* <Avatars /> */}
//       </div>
//       {editor && (
//         <BubbleMenuProvider>
//           <CustomBubbleMenu editor={editor} />
//           <AiFixGrammarAndSpellCheckBubbleMenu editor={editor} />
//           <AiSummarizeBubbleMenu editor={editor} />
//         </BubbleMenuProvider>
//       )}
//       <EditorContent editor={editor} className="relative h-full" />
//     </div>
//   );
// }
