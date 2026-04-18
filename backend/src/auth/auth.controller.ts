import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { type RegisterDto, registerSchema } from './dto/register.dto';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { type LoginDto, loginSchema } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser('sub') userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    const tokens = await this.authService.refresh(userId, refreshToken);

    return tokens;
  }
}
