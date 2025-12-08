
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationPin(to: string, pin: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Verify Your Account',
      text: `Your verification PIN is: ${pin}`,
      html: `<b>Your verification PIN is: ${pin}</b>`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    user: { email: string; name: string | null },
    token: string,
  ) {
    // El URL debe apuntar a tu aplicación frontend
    const resetUrl = `http://localhost:3001/auth/reset-password?token=${token}`;

    const mailOptions = {
      to: user.email,
      from: this.configService.get<string>('EMAIL_USER'),
      subject: 'Ecofinz - Restablecimiento de Contraseña',
      html: `
      <h1>Hola${user.name ? `, ${user.name}` : ''}</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetUrl}" target="_blank">Restablecer Contraseña</a>
      <p>Este enlace expirará en 15 minutos.</p>
      <p>Si no solicitaste esto, por favor ignora este correo.</p>
    `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
