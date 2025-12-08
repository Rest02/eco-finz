# Plan de Implementación: Recuperar Contraseña

> **Contexto de la Funcionalidad:**
> Esta funcionalidad permitirá a los usuarios que han olvidado su contraseña solicitar un restablecimiento de la misma. El sistema enviará un enlace seguro y de tiempo limitado a su correo electrónico registrado. Al hacer clic en el enlace, el usuario podrá establecer una nueva contraseña y recuperar el acceso a su cuenta.

### Principios de Implementación
**Es fundamental seguir las convenciones y la estructura existentes del proyecto.** Asegúrate de que el nuevo código sea coherente con el estilo actual, reutilice los servicios y módulos de forma adecuada (como `PrismaService` y `EmailService`) y siga las buenas prácticas para mantener la calidad y la mantenibilidad de la base del código.

---

### **Nota Importante sobre Comandos**

A lo largo de esta guía, se mencionarán comandos de terminal necesarios para tareas como migraciones de base de datos o ejecución del proyecto. La ejecución de todos los comandos en la consola es responsabilidad del **desarrollador (usuario)**. La IA no ejecutará comandos directamente.

**Ejemplo:**
```bash
# El usuario debe ejecutar este comando en su terminal
npx prisma migrate dev --name add_reset_password_fields
```

---

## Fase 1: Preparación de la Base de Datos y Entorno

En esta fase, prepararemos la base de datos para almacenar la información necesaria y crearemos los archivos básicos para la nueva lógica.

#### [x] **Tarea 1.1: Modificar el Esquema de Prisma**

Necesitamos añadir campos al modelo `User` para gestionar el token de restablecimiento.

*   **Archivo a modificar:** `prisma/schema.prisma`
*   **Acción:** Añade los siguientes campos al modelo `User`:

```prisma
model User {
  // ... campos existentes
  
  resetPasswordToken   String?
  resetPasswordExpires DateTime?
}
```

#### [x] **Tarea 1.2: Crear y Aplicar la Migración**

Con el esquema actualizado, genera y aplica la migración a tu base de datos.

*   **Acción:** El **usuario** debe ejecutar el siguiente comando en su terminal.

```bash
npx prisma migrate dev --name add_reset_password_fields
```
*   **Verificación:** Asegúrate de que la migración se haya aplicado correctamente y que la carpeta de migración correspondiente se haya creado en `prisma/migrations`.

#### [x] **Tarea 1.3: Crear Archivos DTO (Data Transfer Objects)**

Estos archivos definirán la estructura de los datos que esperamos en nuestras nuevas rutas.

*   **Ubicación:** `src/auth/dto/`
*   **Acción:** Crear los siguientes dos archivos:

1.  **`forgot-password-auth.dto.ts`**:
    ```typescript
    import { IsEmail, IsNotEmpty } from 'class-validator';

    export class ForgotPasswordAuthDto {
      @IsNotEmpty()
      @IsEmail()
      email: string;
    }
    ```

2.  **`reset-password-auth.dto.ts`**:
    ```typescript
    import { IsNotEmpty, IsString, MinLength } from 'class-validator';

    export class ResetPasswordAuthDto {
      @IsNotEmpty()
      @IsString()
      token: string;

      @IsNotEmpty()
      @IsString()
      @MinLength(8, { message: 'Password must be at least 8 characters long' })
      password: string;
    }
    ```

---

## Fase 2: Lógica del Backend - Solicitud de Restablecimiento

Implementaremos el endpoint y el servicio para que el usuario solicite el enlace de restablecimiento.

#### [ ] **Tarea 2.1: Crear Endpoint `forgot-password`**

*   **Archivo a modificar:** `src/auth/auth.controller.ts`
*   **Acción:** Añade un nuevo método público en `AuthController`.

```typescript
// Dentro de AuthController
@Post('forgot-password')
async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordAuthDto) {
  return this.authService.forgotPassword(forgotPasswordDto.email);
}
```
*No olvides importar `ForgotPasswordAuthDto` y `Post` si aún no están.*

#### [ ] **Tarea 2.2: Implementar Lógica en `auth.service`**

*   **Archivo a modificar:** `src/auth/auth.service.ts`
*   **Acción:** Añade el método `forgotPassword`. Necesitarás importar el módulo `crypto` de Node.js.

```typescript
import * as crypto from 'crypto';

// Dentro de AuthService
async forgotPassword(email: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Para no revelar si un email existe o no, respondemos siempre de forma genérica.
    return { message: 'If a user with that email exists, a password reset link has been sent.' };
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
    throw new InternalServerErrorException('Could not send password reset email.');
  }
}
```

#### [ ] **Tarea 2.3: Implementar Envío de Correo**

*   **Archivo a modificar:** `src/email/email.service.ts`
*   **Acción:** Crea un método para enviar el correo de restablecimiento.

```typescript
// Dentro de EmailService
async sendPasswordResetEmail(user: { email: string; name: string }, token: string) {
  // El URL debe apuntar a tu aplicación frontend
  const resetUrl = `http://localhost:3001/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    to: user.email,
    subject: 'Ecofinz - Restablecimiento de Contraseña',
    html: `
      <h1>Hola, ${user.name}</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetUrl}" target="_blank">Restablecer Contraseña</a>
      <p>Este enlace expirará en 15 minutos.</p>
      <p>Si no solicitaste esto, por favor ignora este correo.</p>
    `,
  };
  await this.transporter.sendMail(mailOptions);
}
```

---

## Fase 3: Lógica del Backend - Ejecución del Restablecimiento

Implementaremos la lógica para verificar el token y actualizar la contraseña.

#### [ ] **Tarea 3.1: Crear Endpoint `reset-password`**

*   **Archivo a modificar:** `src/auth/auth.controller.ts`
*   **Acción:** Añade el siguiente método público.

```typescript
// Dentro de AuthController
@Post('reset-password')
async resetPassword(@Body() resetPasswordDto: ResetPasswordAuthDto) {
  return this.authService.resetPassword(
    resetPasswordDto.token,
    resetPasswordDto.password,
  );
}
```
*No olvides importar `ResetPasswordAuthDto`.*

#### [ ] **Tarea 3.2: Implementar Lógica en `auth.service`**

*   **Archivo a modificar:** `src/auth/auth.service.ts`
*   **Acción:** Añade el método `resetPassword`.

```typescript
// Dentro de AuthService
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
```
*Asegúrate de tener `bcrypt` y `UnauthorizedException` importados.*