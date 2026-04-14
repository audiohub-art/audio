import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { S3Module } from 'src/s3/s3.module';
import { AuthModule } from 'src/auth/auth.module';
import { AudioService } from './audio.service';

@Module({
  imports: [S3Module, AuthModule],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
