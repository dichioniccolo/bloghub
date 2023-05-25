"use server";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { env } from "../../env.mjs";
import { s3 } from "../media";

export async function deleteMedia(url: string) {
  // take only last part of url after the first slash without https://
  const fileName = url.split("/").slice(3).join("/");

  return await s3.send(
    new DeleteObjectCommand({
      Bucket: env.DO_BUCKET,
      Key: fileName,
    }),
  );
}

export async function deleteMedias(urls: string[]) {
  return await Promise.all(urls.map((url) => deleteMedia(url)));
}

export async function uploadFile(
  name: string,
  file: Buffer,
  metadata?: Record<string, string>,
) {
  const command = new PutObjectCommand({
    Bucket: env.DO_BUCKET,
    Key: name,
    Body: file,
    ACL: "public-read",
    Metadata: metadata,
  });

  return await s3.send(command);
}

// export async function createPresignedUrl(name: string) {
//   const command = new GetObjectCommand({
//     Bucket: env.DO_BUCKET,
//     Key: name,
//   });

//   return await getSignedUrl(s3, command, { expiresIn: 3600 });
// }
