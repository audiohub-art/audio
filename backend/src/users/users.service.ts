import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: number, updateUser: UpdateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const dataToUpdate = { ...updateUser };

    return await this.prisma.users.update({
      where: { id: userId },
      data: dataToUpdate,
    });
  }

  async deleteUser(userId: number) {
    const existingUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    return await this.prisma.users.delete({
      where: { id: userId },
    });
  }

  async getMe(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            createdAt: true,
            description: true,
            status: true,
            title: true,
            audioFile: {
              select: {
                id: true,
                duration: true,
                key: true,
                originalName: true,
                status: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserBySlug(slug: string) {
    const user = await this.prisma.users.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            createdAt: true,
            description: true,
            status: true,
            title: true,
            audioFile: {
              select: {
                id: true,
                duration: true,
                key: true,
                originalName: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.users.findMany();
    return users;
  }

  async followUser(userId: number, targetUserId: number) {
    const follow = await this.prisma.follow.create({
      data: {
        followerId: userId,
        followedId: targetUserId,
      },
    });
    if (!follow) {
      throw new Error('Failed to follow user');
    }
    return await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        following: true,
      },
    });
  }

  async unfollowUser(userId: number, targetUserId: number) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: userId,
          followedId: targetUserId,
        },
      },
    });
    if (!follow) {
      throw new Error('Failed to unfollow user');
    }
    await this.prisma.follow.delete({
      where: {
        followerId_followedId: {
          followerId: follow.followerId,
          followedId: follow.followedId,
        },
      },
    });
    return await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        following: true,
      },
    });
  }

  async getFollowStatus(userId: number, targetUserId: number) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: userId,
          followedId: targetUserId,
        },
      },
    });
    return !!follow;
  }

  async getFollowing(userId: number) {
    return await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        following: true,
      },
    });
  }
}
