"use server";

import { del, put } from "@vercel/blob";

export async function deleteFile(url: string) {
  return await del(url);
}

export async function deleteFiles(urls: string[]) {
  if (urls.length === 0) {
    return;
  }

  return await del(urls);
}

export async function uploadFile(
  name: string,
  file: Buffer,
  contentType: string,
) {
  return await put(name, file, {
    contentType,
    access: "public",
  });
}

export async function uploadFiles(
  files: {
    name: string;
    file: Buffer;
    contentType: string;
  }[],
) {
  return await Promise.allSettled(
    files.map((file) => uploadFile(file.name, file.file, file.contentType)),
  );
}
