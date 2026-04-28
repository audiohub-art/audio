import {
  Body,
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { type UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';


@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteUser(id);
  }

  @Get('me')
  async getMe(@CurrentUser('sub') userId: number) {
    return await this.usersService.getMe(userId);
  }

  @Get(':id')
  @Public()
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getUserById(id);
  }

  @Get()
  async getAllUser() {
    return await this.usersService.getAllUsers();
  }
}
