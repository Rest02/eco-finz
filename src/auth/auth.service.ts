import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { EmailService } from '../email/email.service';
import { VerifyAccountDto } from './dto/verify-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const { email, password, name } = registerAuthDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyPin = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await this.usersService.createUser({
      email,
      password: hashedPassword,
      name,
      verifyPin,
    });

    await this.emailService.sendVerificationPin(newUser.email, verifyPin);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, verifyPin: __, ...result } = newUser;
    return result;
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const { email, verifyPin } = verifyAccountDto;

    const user = await this.prisma.user.findFirst({
      where: { email, verifyPin },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification PIN.');
    }

    await this.usersService.updateUser({
      where: { id: user.id },
      data: { verified: true, verifyPin: null },
    });

    return { message: 'Account verified successfully.' };
  }
}

