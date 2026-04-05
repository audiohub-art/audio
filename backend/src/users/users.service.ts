import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { name: createUserDto.name },
    });

    if (existingUser) {
      throw new ConflictException('This name is already take');
    }
    return this.prisma.users.create({
      data: createUserDto,
    });
  }

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

  async getAllUsers() {
    const users = await this.prisma.users.findMany();
    return users;
  }
}
