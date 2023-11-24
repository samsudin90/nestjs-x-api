import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }), UserModule, AuthModule, PrismaModule, PostModule]
})
export class AppModule {}
