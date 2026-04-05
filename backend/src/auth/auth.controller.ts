import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { type RegisterDto, registerSchema } from './dto/register.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return await this.authService.register(registerDto);
  }
}
