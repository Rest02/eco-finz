import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { EmailService } from '../email/email.service';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(pass, user.password))) {
      return null;
    }

    if (!user.verified) {
      throw new UnauthorizedException(
        'Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

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

    try {
      await this.emailService.sendVerificationPin(newUser.email, verifyPin);
      console.log('Verification email sent successfully to:', newUser.email);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // NOTA: El usuario igualmente se crea. Verificar configuración de EMAIL en variables de entorno.
    }

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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Para no revelar si un email existe o no, respondemos siempre de forma genérica.
      return {
        message:
          'If a user with that email exists, a password reset link has been sent.',
      };
    }

    // 1. Generar token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 2. Establecer expiración (e.g., 15 minutos)
    const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

    // 3. Guardar en la base de datos
    await this.prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: passwordResetToken,
        resetPasswordExpires: passwordResetExpires,
      },
    });

    // 4. Enviar email (se detalla en la siguiente tarea)
    // NOTA: Enviamos `resetToken` (el original, no el hasheado) al usuario.
    try {
      await this.emailService.sendPasswordResetEmail(user, resetToken);
      return { message: 'Password reset link has been sent to your email.' };
    } catch (error) {
      // En caso de fallo de email, es buena idea limpiar el token para evitar confusiones.
      await this.prisma.user.update({
        where: { email },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
      throw new InternalServerErrorException(
        'Could not send password reset email.',
      );
    }
  }

  async resetPassword(token: string, newPass: string) {
    // 1. Hashear el token recibido para compararlo con el de la BD
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Buscar usuario por token y verificar expiración
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token is invalid or has expired.');
    }

    // 3. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPass, 10); // Asegúrate de tener bcrypt

    // 4. Actualizar contraseña y limpiar tokens
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Password has been updated successfully.' };
  }
}

