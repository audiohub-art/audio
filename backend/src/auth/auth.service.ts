import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import slug from 'slug';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ name: registerDto.name }, { email: registerDto.email }],
      },
    });

    if (existingUser) {
      if (existingUser.name === registerDto.name) {
        throw new ConflictException('This username is already taken');
      } else if (existingUser.email === registerDto.email) {
        throw new ConflictException('This email is already registered');
      }
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    if (!registerDto.email) {
      throw new BadRequestException('Email is required');
    }
    if (!registerDto.name) {
      throw new BadRequestException('Name is required');
    }
    const user = await this.prisma.users.create({
      data: {
        ...registerDto,
        slug: slug(registerDto.name),
        password: hashedPassword,
      },
    });
    return this.generateAndStoreTokens(user.id, user.name, user.email);
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.generateAndStoreTokens(user.id, user.name, user.email);
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }
    const isValid = this.hashToken(refreshToken) === user.refreshToken;
    if (!isValid) {
      await this.prisma.users.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
      throw new ForbiddenException('Invalid token');
    }
    return this.generateAndStoreTokens(userId, user.name, user.email);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async generateAndStoreTokens(
    userId: number,
    name: string,
    email: string,
  ) {
    const payload = { sub: userId, name, email };
    const expiresIn = 15 * 60;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: expiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: this.hashToken(refreshToken) },
      select: {
        id: true,
        email: true,
        name: true,
        slug: true,
      },
    });
    return { accessToken, refreshToken, expiresIn, user };
  }
}
