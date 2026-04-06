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
    console.log('user id : ', userId);
    console.log('refreshToken', refreshToken);
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });
    console.log('hashed refresh token in base : ', user?.refreshToken);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access denied');
    }
    console.log(
      'token reçu (50 premiers chars):',
      refreshToken.substring(0, 50),
    );
    console.log(
      'hash en base (50 premiers chars):',
      user.refreshToken.substring(0, 50),
    );
    console.log('longueur token reçu:', refreshToken.length);
    const isValid = this.hashToken(refreshToken) === user.refreshToken;
    console.log('is valide', isValid);
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
    console.log('payload', payload);
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
    console.log('new refresh token : ', refreshToken);
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: this.hashToken(refreshToken) },
    });
    console.log('hashed refresh token', user.refreshToken);
    return { accessToken, refreshToken };
  }
}
