# Bitácora de Cambios

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/es/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-04

### Añadido
- **Módulo de Autenticación de Usuarios (`/auth`)**:
  - Implementación de registro de usuarios con hash de contraseña (`/auth/register`).
  - Verificación de cuenta a través de un PIN de 6 dígitos enviado por correo (`/auth/verify`).
  - Implementación de inicio de sesión con email y contraseña (`/auth/login`) usando Passport.js.
  - Generación de JSON Web Token (JWT) para la gestión de sesiones.
  - Creación de `LocalStrategy` para validación de credenciales y `JwtStrategy` para validación de tokens.
  - Adición de `LocalAuthGuard` y `JwtAuthGuard` para proteger los endpoints de la API.
  - Creación de una ruta protegida (`/auth/profile`) para obtener los datos del usuario autenticado.
- **Servicio de Correo (`/email`)**:
  - Configuración de un servicio con `nodemailer` para enviar correos transaccionales para la verificación de cuentas.
- **Configuración**:
  - Uso de `@nestjs/config` para gestionar secretos y variables de la aplicación (`JWT_SECRET`, credenciales de correo) a través de un archivo `.env`.
- **Validación de Datos**:
  - Creación de Objetos de Transferencia de Datos (DTOs) para registro, verificación e inicio de sesión usando `class-validator`.

### Cambiado
- **Esquema de la Base de Datos**:
  - Actualización del modelo `User` en `prisma/schema.prisma` para incluir los campos `password`, `verified` y `verifyPin`.
  - Limpieza del esquema eliminando el modelo `Post` que no se utilizaba.
- **Estructura del Proyecto**:
  - Eliminación del módulo obsoleto `/posts` y sus archivos relacionados.

### Corregido
- **Seguridad**:
  - Se corrigió un fallo de lógica que permitía a usuarios no verificados iniciar sesión y recibir un token de acceso.
- **Dependencias**:
  - Se instalaron los paquetes faltantes `passport-jwt` y `@types/passport-jwt` requeridos para la autenticación JWT.
- **Errores de TypeScript**:
  - Se resolvió un desajuste de tipo entre el `sub` del payload del JWT (string) y el `id` de usuario esperado por Prisma (number).
  - Se solucionó un error de tipo donde `JWT_SECRET` podía ser `undefined` añadiendo una comprobación explícita al iniciar la aplicación.
