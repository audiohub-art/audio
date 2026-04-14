import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { S3Module } from 'src/s3/s3.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [S3Module, AuthModule],
  controllers: [AudioController],
})
export class AudioModule {}
