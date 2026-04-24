import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly privateClient: S3Client;
  private readonly publicClient: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET_NAME!;

    this.privateClient = new S3Client({
      region: 'us-east-1',
      endpoint: `${process.env.S3_ENDPOINT}`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
    });
    this.publicClient = new S3Client({
      region: 'us-east-1',
      endpoint: `${process.env.S3_PUBLIC_ENDPOINT}`,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
      },
    });
  }

  async uploadAudio(
    file: Express.Multer.File,
  ): Promise<{ key: string; url: string }> {
    const key = `audio/${randomUUID()}-${file.originalname}`;
    await this.privateClient.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        Metadata: {
          originalName: file.originalname,
        },
      }),
    );

    const url = await this.getSignedUrl(key);
    return { key, url };
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.publicClient, command, { expiresIn });
  }
}
