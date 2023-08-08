"use server";

import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { env } from "~/env.mjs";
import { s3 } from ".";

function getFileName(url: string) {
  // take only last part of url after the first slash without https://
  return url.split("/").slice(3).join("/");
}

export async function deleteMedia(url: string) {
  return await s3.send(
    new DeleteObjectCommand({
      Bucket: env.DO_BUCKET,
      Key: getFileName(url),
    }),
  );
}

export async function deleteMedias(urls: string[]) {
  if (urls.length === 0) {
    return;
  }

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: env.DO_BUCKET,
      Delete: {
        Objects: urls.map((url) => ({
          Key: getFileName(url),
        })),
      },
    }),
  );
}

export async function uploadFile(
  name: string,
  file: Buffer,
  contentType: string,
  metadata?: Record<string, string>,
) {
  const command = new PutObjectCommand({
    Bucket: env.DO_BUCKET,
    Key: name,
    Body: file,
    ACL: "public-read",
    Metadata: metadata,
    ContentType: contentType,
  });

  return await s3.send(command);
}
