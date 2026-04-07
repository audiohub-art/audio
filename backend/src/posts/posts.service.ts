import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    await this.prisma.posts.create({
      data: {
        title: createPostDto.title,
        description: createPostDto.description,
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll() {
    const posts = await this.prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return posts;
  }
}
