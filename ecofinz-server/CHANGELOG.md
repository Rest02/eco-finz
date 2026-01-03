# Bitácora de Cambios

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/es/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Corregido

#### JWT Strategy - Type Mismatch (2026-01-02)

**Problema:**
- Error en `src/auth/strategies/jwt.strategy.ts` línea 27
- TypeScript Error: `Type 'number' is not assignable to type 'string'`

**Causa Raíz:**
- El campo `id` en el modelo User de Prisma se define como `String @id @default(cuid())`
- El código estaba convirtiendo `payload.sub` a número usando `parseInt()`, cuando debería pasarse como string

**Solución:**
```typescript
// Antes:
const id = parseInt(payload.sub, 10);
const user = await this.prisma.user.findUnique({
  where: { id },
});

// Después:
const user = await this.prisma.user.findUnique({
  where: { id: payload.sub },
});
```

#### ESM/CommonJS Module System Conflict (2026-01-02)

**Problema:**
- Error: `ReferenceError: exports is not defined in ES module scope`
- Archivo: `dist/src/generated/prisma/client.js:38`
- Conflicto entre módulos CommonJS y ESM (ECMAScript Modules)

**Causa Raíz:**
- `tsconfig.json` configurado con `"module": "nodenext"` generaba salida ESM
- NestJS está diseñado para CommonJS
- Prisma generaba código CommonJS incompatible con la configuración de módulos

**Soluciones Aplicadas:**
1. Actualizar `tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

2. Limpiar caché y regenerar:
```bash
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force src/generated
npx prisma generate
npm run build
npm run start:dev
```

### Cambiado

- **tsconfig.json**: Sistema de módulos actualizado a CommonJS (estándar de NestJS)
  - `"module": "nodenext"` → `"module": "commonjs"`
  - `"moduleResolution": "nodenext"` → `"moduleResolution": "node"`

---

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
