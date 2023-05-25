import { S3Client } from "@aws-sdk/client-s3";

import { env } from "../../env.mjs";

const globalForS3 = globalThis as unknown as { s3: S3Client };

export const s3 =
  globalForS3.s3 ||
  new S3Client({
    forcePathStyle: false,
    endpoint: env.DO_ENDPOINT,
    region: env.DO_REGION,
    credentials: {
      accessKeyId: env.DO_ACCESS_KEY,
      secretAccessKey: env.DO_SECRET_KEY,
    },
  });

if (env.NODE_ENV !== "production") globalForS3.s3 = s3;
