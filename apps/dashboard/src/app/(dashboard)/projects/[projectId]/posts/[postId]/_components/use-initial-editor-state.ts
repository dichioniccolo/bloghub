// "use client";

// import { useEffect, useState } from "react";
// import type { Editor } from "@tiptap/core";
// import type { Schema } from "@tiptap/pm/model";
// import { prosemirrorJSONToYXmlFragment } from "y-prosemirror";

// import { yProvider } from "@acme/editor";

// export function useInitialEditorState(editor: Editor | null, content: string) {
//   const [seedInitialState, setSeedInitialState] =
//     useState<(editor: Schema) => void>();

//   useEffect(() => {
//     const handleSync = (connected: boolean) => {
//       if (connected) {
//         setSeedInitialState(() => (schema: Schema) => {
//           const aloneInTheRoom = yProvider.awareness.getStates().size === 1;
//           const fragment = yProvider.doc.getXmlFragment("content");

//           if (
//             aloneInTheRoom &&
//             (fragment.length === 0 ||
//               (fragment.length === 1 &&
//                 fragment.toJSON() === "<paragraph></paragraph>"))
//           ) {
//             prosemirrorJSONToYXmlFragment(schema, content, fragment);
//           }
//         });
//       }
//     };

//     yProvider.on("sync", handleSync);

//     return () => yProvider.off("sync", handleSync);
//   }, []);

//   useEffect(() => {
//     if (editor && seedInitialState) {
//       seedInitialState(editor.schema);
//     }
//   }, [editor, seedInitialState]);
// }
