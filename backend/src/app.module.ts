import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { S3Module } from './s3/s3.module';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    S3Module,
    AudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
