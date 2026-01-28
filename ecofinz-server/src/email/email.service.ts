
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendVerificationPin(to: string, pin: string) {
    const from = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'noreply@example.com';

    console.log('=== SendGrid Email Debug ===');
    console.log('From:', from);
    console.log('To:', to);
    console.log('PIN:', pin);

    const msg = {
      to,
      from,
      subject: 'Verify Your Account - EcoFinz',
      html: `<b>Your verification PIN is: ${pin}</b>`,
    };

    try {
      const result = await sgMail.send(msg);
      console.log('SendGrid Response:', result);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('SendGrid Error:', error);
      if (error.response) {
        console.error('Error details:', error.response.body);
      }
      throw error;
    }
  }

  async sendPasswordResetEmail(
    user: { email: string; name: string | null },
    token: string,
  ) {
    const baseUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;
    const from = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'noreply@example.com';

    const msg = {
      to: user.email,
      from,
      subject: 'Ecofinz - Restablecimiento de Contraseña',
      html: `
        <h1>Hola${user.name ? `, ${user.name}` : ''}</h1>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetUrl}" target="_blank">Restablecer Contraseña</a>
        <p>Este enlace expirará en 15 minutos.</p>
        <p>Si no solicitaste esto, por favor ignora este correo.</p>
      `,
    };

    await sgMail.send(msg);
  }
}
