"use server";

import { del, put } from "@vercel/blob";

// import {
//   DeleteObjectCommand,
//   DeleteObjectsCommand,
//   PutObjectCommand,
// } from "@aws-sdk/client-s3";

// function getFileName(url: string) {
//   // take only last part of url after the first slash without https://
//   return url.split("/").slice(3).join("/");
// }

export async function deleteFile(url: string) {
  return await del(url);
  // return await s3.send(
  //   new DeleteObjectCommand({
  //     Bucket: env.DO_BUCKET,
  //     Key: getFileName(url),
  //   }),
  // );
}

export async function deleteFiles(urls: string[]) {
  if (urls.length === 0) {
    return;
  }

  // await s3.send(
  //   new DeleteObjectsCommand({
  //     Bucket: env.DO_BUCKET,
  //     Delete: {
  //       Objects: urls.map((url) => ({
  //         Key: getFileName(url),
  //       })),
  //     },
  //   }),
  // );
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
  // const command = new PutObjectCommand({
  //   Bucket: env.DO_BUCKET,
  //   Key: name,
  //   Body: file,
  //   ACL: "public-read",
  //   Metadata: metadata,
  //   ContentType: contentType,
  // });

  // return await s3.send(command);
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
