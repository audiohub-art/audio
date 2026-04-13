import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { name: registerDto.name },
    });

    if (existingUser) {
      throw new ConflictException('This name is already taken');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const user = await this.prisma.users.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
    });
    return this.generateAndStoreTokens(user.id, user.name);
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { name: loginDto.name },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.generateAndStoreTokens(user.id, user.name);
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
    return this.generateAndStoreTokens(userId, user.name);
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async generateAndStoreTokens(userId: number, name: string) {
    const payload = { sub: userId, name };
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
        name: true,
      },
    });
    return { accessToken, refreshToken, expiresIn, user };
  }
}
