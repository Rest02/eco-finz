import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [UsersModule, PrismaModule, EmailModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
