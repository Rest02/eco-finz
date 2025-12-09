# Plan de Integración de Axios para Autenticación en Next.js

Este documento detalla el plan de acción para integrar la librería `axios` en un frontend de Next.js, con el objetivo de gestionar la comunicación con un backend de NestJS para los flujos de autenticación.

## Notas Importantes para el Ejecutor (IA/Usuario)

- **Ejecución de Comandos:** Cualquier comando de terminal especificado en las tareas (como `npm install ...`) debe ser ejecutado por el usuario en su entorno local.
- **Verificación y Pruebas:** El usuario es el responsable final de probar y verificar que cada tarea y fase se ha implementado correctamente. Este plan no incluye tareas de creación de pruebas automatizadas; la validación será manual por parte del usuario.

## Contexto del Proyecto

- **Objetivo:** Implementar un flujo de autenticación de usuario (Registro, Verificación, Login, Perfil) en una aplicación Next.js.
- **Arquitectura:**
  - **Frontend:** Next.js (App Router)
  - **Backend:** NestJS
- **Endpoints del Backend (API):**
  - Se asume que el backend corre en `http://localhost:3001`. Si la URL es diferente, deberá ser ajustada en el archivo de entorno (`.env.local`).
  - **Registro:**
    - **Método:** `POST`
    - **Ruta:** `/auth/register`
  - **Verificación de PIN:**
    - **Método:** `POST`
    - **Ruta:** `/auth/verify`
  - **Inicio de Sesión:**
    - **Método:** `POST`
    - **Ruta:** `/auth/login`
  - **Perfil de Usuario:**
    - **Método:** `GET`
    - **Ruta:** `/auth/profile`

---

## Fases del Proyecto

### Fase 1: Configuración Inicial y Axios

*   [x] **Tarea 1.1: Instalar Axios.**
    - **Comando:** `npm install axios`

*   [x] **Tarea 1.2: Configurar Variable de Entorno.**
    - **Acción:** Crear un archivo llamado `.env` en la raíz del proyecto.
    - **Contenido:** `NEXT_PUBLIC_API_URL=http://localhost:3001`

*   [x] **Tarea 1.3: Crear Instancia Centralizada de Axios.**
    - **Acción:** Crear el archivo `src/lib/apiClient.ts`.
    - **Propósito:** Centraliza la configuración de Axios.

### Fase 2: Creación del Servicio de Autenticación (`authService`)

*   [x] **Tarea 2.1: Crear el archivo del servicio.**
    - **Acción:** Crear el archivo `src/services/authService.ts`.
    - **Propósito:** Encapsular toda la lógica de llamadas a la API de autenticación.

### Fase 3: Gestión del JWT y Peticiones Autenticadas

*   [x] **Tarea 3.1: Configurar Interceptor de Axios para JWT.**
    - **Acción:** Modificar el archivo `src/lib/apiClient.ts` para que intercepte las peticiones y añada el token de autenticación.

### Fase 4: Integración con la UI y Estado Global (React Context)

*   [x] **Tarea 4.1: Crear el `AuthContext`.**
    - **Acción:** Crear el archivo `src/context/AuthContext.tsx`.

*   [x] **Tarea 4.2: Envolver la aplicación con el `AuthProvider`.**
    - **Acción:** Modificar el archivo `src/app/layout.tsx`.

*   [x] **Tarea 4.3: Conectar el `AuthContext` con el `apiClient`.**
    - **Acción:** Modificar `src/app/layout.tsx` o un componente cliente de alto nivel para pasar la función que obtiene el token al `apiClient`.

*   [x] **Tarea 4.4: Crear y conectar las páginas de UI.**
    - **Acción:** Crear los archivos `src/app/auth/register/page.tsx`, `src/app/auth/login/page.tsx` y `src/app/profile/page.tsx`.
    - **Lógica para `login`:** Un formulario que al enviarse llame a la función `login` del `useAuth()`.
    - **Lógica para `profile`:** Usar `useAuth()` para obtener los datos del usuario. Si no hay usuario, redirigir a `/auth/login`.

### Fase 5: Implementación de la Verificación de Usuario

*   [x] **Tarea 5.1: Crear la página de verificación (`/auth/verify`).**
    - **Acción:** Crear el archivo `src/app/auth/verify/page.tsx`.
    - **Lógica:**
        - Un formulario con campos para "email" y "verifyPin".
        - Al enviar, se llamará a la función `verifyUser` del `authService`.
        - En caso de éxito, redirigir al usuario a `/auth/login`.

*   [x] **Tarea 5.2: Actualizar el flujo de registro.**
    - **Acción:** Modificar el archivo `src/app/auth/register/page.tsx`.
    - **Propósito:** Cambiar la redirección post-registro para dirigir al usuario a la página de verificación.
    - **Lógica:** La redirección debe ser `router.push(`/auth/verify?email=${email}`)`.

### Fase 6: Verificación Manual por el Usuario

*   [ ] **Tarea 6.1: El usuario debe verificar la implementación.**
    - **Acción:** Probar manualmente el flujo completo en la aplicación web:
        1.  Navegar a `/auth/register` y crear un nuevo usuario.
        2.  Ser redirigido a `/auth/verify` e introducir el PIN.
        3.  Ser redirigido a `/auth/login` e iniciar sesión.
        4.  Verificar que es redirigido a la página de perfil y se muestran los datos correctos.
        5.  Probar la función de `logout`.