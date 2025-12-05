# Plan de Integración de Axios para Autenticación en Next.js

Este documento detalla el plan de acción para integrar la librería `axios` en un frontend de Next.js, con el objetivo de gestionar la comunicación con un backend de NestJS para los flujos de autenticación.

## Notas Importantes para el Ejecutor (IA/Usuario)

- **Ejecución de Comandos:** Cualquier comando de terminal especificado en las tareas (como `npm install ...`) debe ser ejecutado por el usuario en su entorno local.
- **Verificación y Pruebas:** El usuario es el responsable final de probar y verificar que cada tarea y fase se ha implementado correctamente. Este plan no incluye tareas de creación de pruebas automatizadas; la validación será manual por parte del usuario.

## Contexto del Proyecto

- **Objetivo:** Implementar un flujo de autenticación de usuario (Registro, Verificación, Login, Perfil) en una aplicación Next.js.
- **Arquitectura:**
  - **Frontend:** Next.js
  - **Backend:** NestJS
- **Endpoints del Backend (API):**
  - Se asume que el backend corre en `http://localhost:3001`. Si la URL es diferente, deberá ser ajustada en el archivo de entorno (`.env.local`).
  - **Registro:**
    - **Método:** `POST`
    - **Ruta:** `/auth/register`
    - **Cuerpo (Body):** `{ "name": "string", "email": "string", "password": "string" }`
  - **Verificación de PIN:**
    - **Método:** `POST`
    - **Ruta:** `/auth/verify`
    - **Cuerpo (Body):** `{ "email": "string", "verifyPin": "string" }`
  - **Inicio de Sesión:**
    - **Método:** `POST`
    - **Ruta:** `/auth/login`
    - **Cuerpo (Body):** `{ "email": "string", "password": "string" }`
    - **Respuesta Exitosa:** Devuelve un objeto con el token, ej: `{ "token": "ey..." }`
  - **Perfil de Usuario:**
    - **Método:** `GET`
    - **Ruta:** `/auth/profile`
    - **Autenticación:** Requiere un JSON Web Token (JWT) en el encabezado `Authorization` como `Bearer <token>`.

---

## Fases del Proyecto

### Fase 1: Configuración Inicial y Axios

*   [ ] **Tarea 1.1: Instalar Axios.**
    - **Acción:** Ejecutar el siguiente comando en la terminal del proyecto.
    - **Comando:** `npm install axios`

*   [ ] **Tarea 1.2: Configurar Variable de Entorno.**
    - **Acción:** Crear un archivo llamado `.env.local` en la raíz del proyecto.
    - **Contenido:**
      ```
      NEXT_PUBLIC_API_URL=http://localhost:3001
      ```

*   [ ] **Tarea 1.3: Crear Instancia Centralizada de Axios.**
    - **Acción:** Crear la carpeta `lib` en la raíz si no existe. Dentro, crear el archivo `lib/apiClient.js`.
    - **Propósito:** Centraliza la configuración de Axios, permitiendo definir la URL base y futuros interceptores en un solo lugar.
    - **Contenido:**
      ```javascript
      import axios from 'axios';

      const apiClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      export default apiClient;
      ```

### Fase 2: Creación del Servicio de Autenticación (`authService`)

*   [ ] **Tarea 2.1: Crear el archivo del servicio.**
    - **Acción:** Crear la carpeta `services` en la raíz si no existe. Dentro, crear el archivo `services/authService.js`.
    - **Propósito:** Encapsular toda la lógica de llamadas a la API de autenticación.

*   [ ] **Tarea 2.2: Implementar funciones de autenticación.**
    - **Acción:** Añadir el siguiente contenido a `services/authService.js`. Se importa el `apiClient` de la fase anterior.
    - **Contenido:**
      ```javascript
      import apiClient from '../lib/apiClient';

      export const registerUser = (name, email, password) => {
        return apiClient.post('/auth/register', { name, email, password });
      };

      export const verifyUser = (email, verifyPin) => {
        return apiClient.post('/auth/verify', { email, verifyPin });
      };

      export const loginUser = (email, password) => {
        return apiClient.post('/auth/login', { email, password });
      };
      
      export const getUserProfile = () => {
        return apiClient.get('/auth/profile');
      };
      ```

### Fase 3: Gestión del JWT y Peticiones Autenticadas

*   [ ] **Tarea 3.1: Configurar Interceptor de Axios para JWT.**
    - **Acción:** Modificar el archivo `lib/apiClient.js` para que intercepte las peticiones y añada el token de autenticación si existe.
    - **Nota:** La función `getToken` será una función auxiliar que obtendrá el token del estado global (que se creará en la Fase 4). Por ahora, el código se prepara para ello.
    - **Contenido Actualizado para `lib/apiClient.js`:**
      ```javascript
      import axios from 'axios';

      // Esta función es un placeholder. Se conectará al estado global más adelante.
      let getToken = () => null;

      export const setAuthTokenProvider = (tokenProvider) => {
        getToken = tokenProvider;
      };
      
      const apiClient = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Interceptor para añadir el token a cada petición
      apiClient.interceptors.request.use(
        (config) => {
          const token = getToken();
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      export default apiClient;
      ```

### Fase 4: Integración con la UI y Estado Global (React Context)

*   [ ] **Tarea 4.1: Crear el `AuthContext`.**
    - **Acción:** Crear la carpeta `context` en la raíz. Dentro, crear `context/AuthContext.js`.
    - **Propósito:** Proveer un estado global para la autenticación (datos del usuario, token) y las funciones para manipularlo (`login`, `logout`).
    - **Contenido:**
      ```javascript
      // Contenido inicial para context/AuthContext.js
      // Se completará la lógica en la implementación.
      import { createContext, useContext } from 'react';

      const AuthContext = createContext(null);

      export function AuthProvider({ children }) {
        // Lógica para user, token, login, logout, etc. irá aquí.
        const value = {}; // Placeholder
        return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
      }

      export const useAuth = () => useContext(AuthContext);
      ```

*   [ ] **Tarea 4.2: Envolver la aplicación con el `AuthProvider`.**
    - **Acción:** Modificar el archivo `pages/_app.js`.
    - **Contenido:**
      ```javascript
      import { AuthProvider } from '../context/AuthContext';

      function MyApp({ Component, pageProps }) {
        return (
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        );
      }

      export default MyApp;
      ```

*   [ ] **Tarea 4.3: Conectar el `AuthContext` con el `apiClient`.**
    - **Acción:** Modificar de nuevo `pages/_app.js` para pasar la función que obtiene el token al `apiClient`.
    - **Propósito:** Cierra el círculo entre el estado de autenticación y el interceptor de Axios.

*   [ ] **Tarea 4.4: Crear y conectar las páginas de UI.**
    - **Acción:** Crear los archivos `pages/register.js`, `pages/login.js` y `pages/profile.js`.
    - **Propósito:** Implementar los formularios y la lógica de UI para llamar a las funciones del `AuthContext` (que a su vez llamarán al `authService`).
    - **Lógica para `login.js`:** Un formulario que al enviarse llame a la función `login` del `useAuth()`.
    - **Lógica para `profile.js`:** Usar `useAuth()` para obtener los datos del usuario. Si no hay usuario, redirigir a `/login`.

### Fase 5: Verificación Manual por el Usuario

*   [ ] **Tarea 5.1: El usuario debe verificar la implementación.**
    - **Acción:** Una vez completadas las fases anteriores, el usuario debe probar manualmente el flujo completo en la aplicación web:
        1.  Navegar a la página de registro y crear un nuevo usuario.
        2.  Navegar a la página de login e iniciar sesión.
        3.  Verificar que es redirigido o puede navegar a la página de perfil.
        4.  Verificar que en la página de perfil se muestran los datos correctos.
        5.  Implementar y probar la función de `logout`.
