import { type PropsWithChildren } from "react";
import { type Editor } from "@tiptap/core";

import { UploaderDialog } from "./uploader";
import { UploaderProvider } from "./uploader/context";

type Props = {
  editable?: boolean;
  editor: Editor;
  userId?: string;
  projectId?: string;
  postId?: string;
} & PropsWithChildren;

export function Providers({
  editable,
  editor,
  children,
  userId,
  projectId,
  postId,
}: Props) {
  if (!editable) {
    return children;
  }

  if (editable && (!userId || !projectId || !postId)) {
    return children;
  }

  return (
    <UploaderProvider editor={editor}>
      {children}
      <UploaderDialog userId={userId} projectId={projectId} postId={postId} />
    </UploaderProvider>
  );
}
