import { S3Client } from '@aws-sdk/client-s3';

export const s3InternalClient = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.S3_ENDPOINT as string,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

export const s3PublicClient = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.S3_PUBLIC_ENDPOINT as string,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});
