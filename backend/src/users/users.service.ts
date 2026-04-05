import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  async getAllUsers() {
    const users = await this.prisma.users.findMany();
    return users;
  }
}
