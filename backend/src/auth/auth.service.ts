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
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

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
      throw new ConflictException('This name is already take');
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
      throw new UnauthorizedException('Identifiants invalides');
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
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isValid) {
      await this.prisma.users.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
      throw new ForbiddenException('Invalid token');
    }
    return this.generateAndStoreTokens(user.id, user.name);
  }

  private async generateAndStoreTokens(userId: number, name: string) {
    const payload = { sub: userId, name };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
    return { accessToken, refreshToken };
  }
}
