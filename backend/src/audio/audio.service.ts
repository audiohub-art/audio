import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class AudioService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
  ) {}

  async uploadAudioFile(userId: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');

    let result: { key: string; url: string };
    try {
      result = await this.s3.uploadAudio(file);
    } catch {
      throw new InternalServerErrorException();
    }
    try {
      return await this.prisma.$transaction(async (tx) => {
        const newAudio = await tx.audios.create({
          data: {
            key: result.key,
            mimeType: file.mimetype,
            originalName: file.originalname,
            size: file.size,
          },
        });

        const newPost = await tx.posts.create({
          data: {
            title: '',
            status: 'DRAFT',
            users: {
              connect: { id: userId },
            },
            audioFile: {
              connect: { id: newAudio.id },
            },
          },
        });
        return newPost;
      });
    } catch {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async getUrl(key: string) {
    const url = await this.s3.getSignedUrl(decodeURIComponent(key));
    return { url };
  }
}
