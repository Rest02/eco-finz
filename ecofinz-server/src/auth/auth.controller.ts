import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ResetPasswordAuthDto } from './dto/reset-password-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea un nuevo usuario en estado inactivo y envía un correo electrónico de verificación con un código de 6 dígitos.',
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente. Correo de verificación enviado.' })
  @ApiResponse({ status: 400, description: 'El correo electrónico ya está en uso o los datos son inválidos.' })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verificar cuenta de usuario',
    description: 'Verifica y activa la cuenta del usuario utilizando el código de 6 dígitos enviado a su correo electrónico.',
  })
  @ApiResponse({ status: 200, description: 'Cuenta activada con éxito.' })
  @ApiResponse({ status: 400, description: 'Código inválido, expirado o cuenta ya verificada.' })
  verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un enlace de recuperación con un token seguro al correo electrónico del usuario si este está registrado.',
  })
  @ApiResponse({ status: 201, description: 'Correo de recuperación enviado si el email existe.' })
  @ApiResponse({ status: 400, description: 'Email inválido o no proporcionado.' })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordAuthDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description: 'Permite establecer una nueva contraseña utilizando el token seguro de recuperación enviado por correo.',
  })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida con éxito.' })
  @ApiResponse({ status: 400, description: 'Token inválido, expirado o contraseñas no válidas.' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordAuthDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión de usuario',
    description: 'Autentica al usuario mediante sus credenciales locales (email y contraseña) y devuelve un token JWT.',
  })
  @ApiResponse({ status: 200, description: 'Autenticación exitosa. Devuelve el token de acceso JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas (email o contraseña incorrectos).' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Request() req, @Body() loginDto: LoginAuthDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Obtiene la información detallada del usuario correspondiente al token JWT provisto en la cabecera de la petición.',
  })
  @ApiResponse({ status: 200, description: 'Información del perfil del usuario obtenida con éxito.' })
  @ApiResponse({ status: 401, description: 'Token faltante, inválido o expirado.' })
  getProfile(@Request() req) {
    return req.user;
  }
}
