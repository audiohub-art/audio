import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
    return this.generateTokens(user.id, user.name);
  }

  private async generateTokens(userId: number, name: string) {
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
    return { accessToken, refreshToken };
  }
}
