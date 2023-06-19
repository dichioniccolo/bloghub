// import { useEffect, useState } from "react";
// import TiptapCollaboration from "@tiptap/extension-collaboration";
// import TiptapCursor from "@tiptap/extension-collaboration-cursor";
// import YProvider from "y-partykit/provider";
// import * as Y from "yjs";

// // const partykitHost = "localhost:1999"
// const partykitHost = "yjs.threepointone.partykit.dev/party";

// const yDoc = new Y.Doc();
// export const yProvider = new YProvider(
//   partykitHost,
//   "novel-yjs-multiplayer-party",
//   yDoc,
//   { connect: false },
// );

// if (typeof window !== "undefined") {
//   window.addEventListener("beforeunload", () => {
//     if (yProvider.wsconnected) yProvider.disconnect();
//   });
// }

// export const collaborationExtensions = [
//   TiptapCollaboration.configure({ document: yDoc, field: "content" }),
//   TiptapCursor.configure({ provider: yProvider }),
// ];

// export function useConnection() {
//   useEffect(() => {
//     yProvider.connect();
//     return () => yProvider.disconnect();
//   }, []);
// }

// type ConnectionStatus = "disconnected" | "connecting" | "connected";
// export function useConnectionStatus() {
//   const [state, setState] = useState<ConnectionStatus>("disconnected");
//   yProvider.on("status", (event: { status: ConnectionStatus }) => {
//     setState(event.status);
//   });
//   return state;
// }

// const colors = [
//   "#958DF1",
//   "#F98181",
//   "#FBBC88",
//   "#FAF594",
//   "#70CFF8",
//   "#94FADB",
//   "#B9F18D",
// ];

// const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

// export function useCollaborationUser(name: string) {
//   const [currentUser, _] = useState({ name });

//   useEffect(() => {
//     const localState = yProvider.awareness.getLocalState();
//     if (!localState?.user?.name) {
//       const stored = localStorage.getItem("name");
//       if (stored) {
//         const user = { name: stored, color: getRandomColor() };
//         yProvider.awareness.setLocalStateField("user", user);
//         yProvider.once("status", (connected: boolean) => {
//           if (connected) {
//             yProvider.awareness.setLocalStateField("user", user);
//           }
//         });
//       }
//     }
//   }, []);
// }
