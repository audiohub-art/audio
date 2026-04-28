import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AudioService } from './audio.service';

const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/webm',
  'audio/mp3',
  'audio/vnd.wave',
  'audio/x-wav',
  'audio/wave',
];

const audioFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Audio format not supported'), false);
  }
};

@Controller('audio')
@UseGuards(JwtAuthGuard)
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 100 * 1024 * 1024 },
      fileFilter: audioFilter,
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @CurrentUser('sub') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.audioService.uploadAudioFile(userId, file);
  }

  @Get('url')
  @Public()
  async getUrl(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('key is required');
    }
    return this.audioService.getUrl(key);
  }
}
