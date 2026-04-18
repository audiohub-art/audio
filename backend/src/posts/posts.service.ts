import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

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

  async findOne(postId: string) {
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
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

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(postId: string, updatePost: UpdatePostDto) {
    const existingPost = await this.prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not founda');
    }
    return await this.prisma.posts.update({
      where: { id: postId },
      data: { ...updatePost },
    });
  }

  async remove(postId: string) {
    const existingPost = await this.prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }
    return await this.prisma.posts.delete({
      where: { id: postId },
    });
  }
}
