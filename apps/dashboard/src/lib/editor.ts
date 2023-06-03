import { Cursor } from "textarea-markdown-editor";

import { type Media, type MediaType } from "@acme/db";
import { toast } from "@acme/ui";

import { createProjectMedia } from "./shared/actions/create-project-media";

function replacePlaceholder(
  cursor: Cursor,
  placeholder: string,
  replaceWith: string,
) {
  cursor.setValue(cursor.value.replace(placeholder, replaceWith));
}

export function filesWithTypes(files: File[]): FileWithType[] {
  return files
    .map((file) => ({
      file,
      type: determineMediaType(file),
    }))
    .filter((file) => file.type !== null) as FileWithType[];
}

function determineMediaType(file: File): MediaType | null {
  if (/image/i.test(file.type)) {
    return "IMAGE";
  }
  if (/video/i.test(file.type)) {
    return "VIDEO";
  }
  if (/audio/i.test(file.type)) {
    return "AUDIO";
  }
  return null;
}

export function getHtmlByMedia(file: File, media: Media) {
  switch (media.type) {
    case "IMAGE":
      return `<img alt="${file.name}" src="${media.url}" />`;
    case "VIDEO":
      return `<video controls src="${media.url}"></video>`;
    case "AUDIO":
      return `<audio controls src="${media.url}"></audio>`;
    default:
      return "";
  }
}

type FileWithType = {
  file: File;
  type: MediaType;
};

export async function uploadFiles(
  userId: string,
  projectId: string,
  postId: string,
  textarea: HTMLTextAreaElement,
  files: FileWithType[],
) {
  const cursor = new Cursor(textarea);
  const currentLine = cursor.position.line;

  await Promise.all(
    files.map(async ({ file, type }) => {
      const placeholder = `![Uploading ${file.name}...]()`;

      cursor.replaceLine(currentLine.lineNumber, placeholder);

      try {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("type", type);
        formData.append("userId", userId);
        formData.append("projectId", projectId);
        formData.append("postId", postId);

        const media = await createProjectMedia(formData);

        replacePlaceholder(cursor, placeholder, getHtmlByMedia(file, media));
      } catch {
        replacePlaceholder(cursor, placeholder, "");
        toast({
          title: "Error uploading image",
          variant: "destructive",
        });
      }
    }),
  );
}
