# Plan de Implementación: Autenticación de Usuarios

Este documento detalla los pasos a seguir para implementar un sistema de autenticación completo y seguro en el proyecto ecofinz-server, utilizando NestJS y sus módulos recomendados.

## Metodología de Trabajo

Para llevar a cabo este plan, se establece la siguiente dinámica de colaboración:

- **Gemini (Asistente IA)**: Se encargará de escribir, modificar y estructurar todo el código fuente necesario para implementar las funcionalidades.
- **Desarrollador (Tú)**: Serás el responsable de ejecutar todos los comandos en la consola. Esto incluye la instalación de dependencias (`npm install`), la ejecución de migraciones (`npx prisma migrate`), iniciar el servidor de desarrollo y realizar las pruebas.

El asistente te indicará en cada paso el comando exacto que debes ejecutar o la acción que debes realizar.

## Fase 1: Configuración Inicial y Limpieza del Proyecto

El objetivo de esta fase es preparar el proyecto, eliminando código innecesario y añadiendo las dependencias y configuraciones básicas para la autenticación.

- [x] **Tarea 1.1**: Eliminar el modelo `Post` del esquema de Prisma (`prisma/schema.prisma`).
- [x] **Tarea 1.2**: Eliminar la relación `posts` en el modelo `User` del esquema de Prisma.
- [x] **Tarea 1.3**: Eliminar el directorio `src/posts` que contiene el módulo, servicio y controlador de Posts.
- [x] **Tarea 1.4**: Eliminar la importación y el registro de `PostsModule` en el módulo principal de la aplicación (`src/app.module.ts`).
- [x] **Tarea 1.5**: Actualizar el modelo `User` en `prisma/schema.prisma` para incluir los campos `password` (String), `verified` (Boolean, default: false) y `verifyPin` (String, opcional).
- [x] **Tarea 1.6**: Ejecutar una nueva migración de Prisma para aplicar los cambios del esquema a la base de datos. Para ello, se deben seguir estos pasos:
  1.  Abre tu terminal en la raíz del proyecto.
  2.  Ejecuta el siguiente comando. Este generará un nuevo archivo de migración SQL basado en los cambios del `schema.prisma` y lo aplicará a tu base de datos de desarrollo.
      ```bash
      npx prisma migrate dev --name auth_setup_and_cleanup
      ```
  3.  (Opcional) Verifica que se ha creado una nueva carpeta dentro de `prisma/migrations/` con el nombre de la migración y un archivo `migration.sql` en su interior.
- [x] **Tarea 1.7**: Instalar las dependencias de producción y desarrollo necesarias para la autenticación:
  - `npm install @nestjs/passport passport passport-local @nestjs/jwt bcrypt nodemailer`
  - `npm install --save-dev @types/passport-local @types/bcrypt @types/nodemailer`

## Fase 2: Creación de la Estructura del Módulo `auth`

En esta fase, crearemos la estructura de archivos básica para nuestro módulo de autenticación, siguiendo las convenciones de NestJS.

- [x] **Tarea 2.1**: Crear un nuevo módulo `AuthModule` para encapsular toda la lógica de autenticación.
- [x] **Tarea 2.2**: Crear un nuevo servicio `AuthService` donde residirá la lógica de negocio.
- [x] **Tarea 2.3**: Crear un nuevo controlador `AuthController` que manejará las rutas HTTP (`/register`, `/login`, etc.).

## Fase 3: Lógica de Registro y Verificación de Cuenta

Aquí implementaremos el flujo completo para que un nuevo usuario pueda registrarse y verificar su cuenta mediante un PIN enviado a su correo electrónico.

- [x] **Tarea 3.1**: Crear los DTOs (Data Transfer Objects) `RegisterAuthDto` y `VerifyAccountDto` con las validaciones correspondientes usando `class-validator`.
- [x] **Tarea 3.2**: Implementar el método `register` en `AuthService`. Este método se encargará de hashear la contraseña con `bcrypt`, crear el usuario en la base de datos y generar el PIN de verificación.
- [x] **Tarea 3.3**: Crear y configurar un `EmailService` (inyectable) que utilice `nodemailer` para enviar el correo con el PIN. Se deben usar variables de entorno para las credenciales del servicio de correo.
- [x] **Tarea 3.4**: Implementar el método `verifyAccount` en `AuthService` para validar el PIN y actualizar el estado `verified` del usuario.
- [x] **Tarea 3.5**: Crear los endpoints `POST /auth/register` y `POST /auth/verify` en `AuthController` y conectarlos con sus respectivos métodos del servicio.

## Fase 4: Lógica de Login y Sesión con JWT

Esta fase se centra en permitir que un usuario verificado inicie sesión y obtenga un JSON Web Token (JWT) para autenticar solicitudes posteriores.

- [x] **Tarea 4.1**: Crear una `LocalStrategy` de Passport. Esta estrategia utilizará `AuthService` para validar las credenciales (email y contraseña) del usuario.
- [x] **Tarea 4.2**: Implementar el método `validateUser` en `AuthService`, que busca al usuario por email y compara la contraseña usando `bcrypt.compare`.
- [x] **Tarea 4.3**: Implementar el método `login` en `AuthService`, que, tras una validación exitosa, genera un JWT con el payload del usuario (ej. `userId`, `email`).
- [x] **Tarea 4.4**: Configurar `JwtModule.register` dentro de `AuthModule`, proveyendo el `secret` para firmar el token y un tiempo de `expiresIn`. El secreto debe cargarse desde variables de entorno.
- [x] **Tarea 4.5**: Crear el endpoint `POST /auth/login` en `AuthController`, protegiéndolo con el `LocalAuthGuard` de Passport para activar la `LocalStrategy`.

## Fase 5: Protección de Rutas y Verificación de Autenticación

La última fase consiste en utilizar el JWT para proteger rutas específicas de la API, asegurando que solo usuarios autenticados puedan acceder a ellas.

- [x] **Tarea 5.1**: Crear una `JwtStrategy` de Passport. Esta estrategia se encargará de extraer el token del encabezado `Authorization`, verificar su validez y extraer el payload.
- [x] **Tarea 5.2**: Crear una ruta de ejemplo protegida, como `GET /auth/profile`, en `AuthController` y aplicarle el `JwtAuthGuard` para requerir un token válido.
- [x] **Tarea 5.3**: Implementar la lógica en el endpoint `/profile` para que devuelva los datos del usuario autenticado (obtenidos desde el payload del token).
- [x] **Tarea 5.4**: Realizar pruebas para confirmar que la ruta protegida solo es accesible al proporcionar un JWT válido en el encabezado `Authorization: Bearer <token>`.
