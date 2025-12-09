# Plan Detallado de Implementación: Flujo de Recuperación de Contraseña

Este documento es una guía paso a paso para implementar la funcionalidad de recuperación de contraseña en el frontend de Next.js.

---

## Nota Importante para el Usuario

- **Ejecución de Comandos:** Cualquier comando de terminal especificado en este plan (como `npm install ...`) debe ser **ejecutado por ti (el usuario)** en tu entorno local.
- **Rol de la IA:** Mi función es guiarte a través de la implementación. Cuando lleguemos a un punto que requiera la instalación de una dependencia, te indicaré exactamente qué comando debes ejecutar en tu consola. Una vez que lo hayas hecho, continuaremos con los siguientes pasos del plan.

---

## Endpoints del Backend Relevantes

- **Solicitar Restablecimiento:**
  - **Método:** `POST`
  - **Ruta:** `/auth/forgot-password`
  - **Cuerpo (Body):** `{ "email": "string" }`
- **Restablecer Contraseña:**
  - **Método:** `POST`
  - **Ruta:** `/auth/reset-password`
  - **Cuerpo (Body):** `{ "token": "string", "password": "string" }`

---

## Fase 1: Página para Solicitar Restablecimiento de Contraseña

**Objetivo:** Crear la página `/auth/forgot-password` donde el usuario introduce su email para recibir un enlace de recuperación.

- [ ] **Tarea 1.1: Crear la estructura de archivos.**
    - **Acción:** Crear la carpeta y el archivo para la nueva página.
    - **Comandos (informativo):**
      ```bash
      mkdir -p src/app/auth/forgot-password
      touch src/app/auth/forgot-password/page.tsx
      ```

- [ ] **Tarea 1.2: Implementar la estructura base del componente.**
    - **Acción:** Añadir el código inicial al archivo `src/app/auth/forgot-password/page.tsx`.
    - **Propósito:** Definir el componente como un "Client Component" (`'use client'`) ya que gestionará estado e interactuará con el usuario. Importar los hooks necesarios.
    - **Contenido:**
      ```tsx
      'use client';

      import { useState } from 'react';
      import apiClient from '@/lib/apiClient'; // Asumiendo que @ es un alias para src/

      export default function ForgotPasswordPage() {
        // La lógica del estado y del formulario irá aquí
        
        return (
          <div>
            <h1>Recuperar Contraseña</h1>
            {/* El formulario se implementará en la siguiente tarea */}
          </div>
        );
      }
      ```

- [ ] **Tarea 1.3: Implementar el estado del componente.**
    - **Acción:** Añadir los estados para gestionar el formulario y la comunicación con la API.
    - **Propósito:** Controlar el valor del campo de email, el estado de carga y los mensajes de éxito/error.
    - **Contenido a añadir dentro de `ForgotPasswordPage`:**
      ```tsx
      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState('');
      const [error, setError] = useState('');
      ```

- [ ] **Tarea 1.4: Implementar la lógica de envío del formulario.**
    - **Acción:** Crear la función asíncrona que se comunicará con el backend.
    - **Propósito:** Encapsular la llamada a la API, la gestión de la carga y el manejo de respuestas y errores.
    - **Contenido a añadir dentro de `ForgotPasswordPage`:**
      ```tsx
      const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
          const response = await apiClient.post('/auth/forgot-password', { email });
          setMessage(response.data.message);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Ocurrió un error al enviar el correo.');
        } finally {
          setLoading(false);
        }
      };
      ```

- [ ] **Tarea 1.5: Construir el formulario en JSX.**
    - **Acción:** Añadir el código JSX para el formulario y vincularlo con el estado y la lógica creados.
    - **Propósito:** Crear la interfaz visual que el usuario utilizará, con feedback en tiempo real (botón deshabilitado, mensajes).
    - **Contenido a reemplazar en el `return` de `ForgotPasswordPage`:**
      ```tsx
      <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
        <h1>Recuperar Contraseña</h1>
        <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
      ```

---

## Fase 2: Página para Restablecer la Contraseña

**Objetivo:** Crear la página `/auth/reset-password` donde el usuario introduce su nueva contraseña usando el token de la URL.

- [ ] **Tarea 2.1: Crear la estructura de archivos.**
    - **Acción:** Crear la carpeta y el archivo para la nueva página.
    - **Comandos (informativo):**
      ```bash
      mkdir -p src/app/auth/reset-password
      touch src/app/auth/reset-password/page.tsx
      ```

- [ ] **Tarea 2.2: Implementar la estructura base del componente.**
    - **Acción:** Añadir el código inicial al archivo `src/app/auth/reset-password/page.tsx`.
    - **Propósito:** `useSearchParams` es un hook que necesita ejecutarse dentro de un `<Suspense>`. Por ello, se crea un componente principal que envuelve al formulario en Suspense.
    - **Contenido:**
      ```tsx
      'use client';

      import { Suspense } from 'react';
      import ResetPasswordForm from './ResetPasswordForm'; // Componente que crearemos a continuación

      export default function ResetPasswordPage() {
        return (
          <Suspense fallback={<div>Cargando...</div>}>
            <ResetPasswordForm />
          </Suspense>
        );
      }
      ```

- [ ] **Tarea 2.3: Crear el componente del formulario `ResetPasswordForm`.**
    - **Acción:** Crear un nuevo archivo `src/app/auth/reset-password/ResetPasswordForm.tsx` que contendrá la lógica principal.
    - **Propósito:** Aislar el uso del hook `useSearchParams` y la lógica del formulario.
    - **Contenido inicial para `ResetPasswordForm.tsx`:**
      ```tsx
      'use client';

      import { useState, useEffect } from 'react';
      import { useSearchParams, useRouter } from 'next/navigation';
      import apiClient from '@/lib/apiClient';

      export default function ResetPasswordForm() {
        const searchParams = useSearchParams();
        const router = useRouter();

        const [token, setToken] = useState<string | null>(null);
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');
        const [success, setSuccess] = useState(false);

        useEffect(() => {
          const tokenFromUrl = searchParams.get('token');
          if (tokenFromUrl) {
            setToken(tokenFromUrl);
          } else {
            setError('Token no encontrado en la URL.');
          }
        }, [searchParams]);

        const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }
            if (!token) {
                setError('Token no válido.');
                return;
            }

            setLoading(true);
            setError('');

            try {
                await apiClient.post('/auth/reset-password', { token, password });
                setSuccess(true);
            } catch (err: any) {
                setError(err.response?.data?.message || 'El token es inválido o ha expirado.');
            } finally {
                setLoading(false);
            }
        };

        // El JSX del formulario irá aquí
        return <div>Formulario de reseteo</div>;
      }
      ```

- [ ] **Tarea 2.4: Construir el formulario en JSX para `ResetPasswordForm`.**
    - **Acción:** Implementar la interfaz del formulario de reseteo.
    - **Propósito:** Mostrar los campos para la nueva contraseña y dar feedback al usuario. Si el cambio es exitoso, mostrar un mensaje y un enlace para ir al login.
    - **Contenido a reemplazar en el `return` de `ResetPasswordForm`:**
      ```tsx
      <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
        <h1>Restablecer Contraseña</h1>
        {success ? (
          <div>
            <p style={{ color: 'green' }}>¡Tu contraseña ha sido cambiada con éxito!</p>
            <a href="/login" style={{ textDecoration: 'underline' }}>Ir a Iniciar Sesión</a>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password">Nueva Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" disabled={!token || loading} style={{ width: '100%', padding: '10px' }}>
              {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            </button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          </form>
        )}
      </div>
      ```

---

## Fase 3: Mejoras de Experiencia de Usuario (Opcional pero Recomendado)

- [ ] **Tarea 3.1: Integrar Notificaciones con `react-hot-toast`.**
    - **Acción:** Instalar la librería y configurar el proveedor.
    - **Comando:** `npm install react-hot-toast`
    - **Acción 2:** Añadir `<Toaster />` en el `src/app/layout.tsx`.
    - **Acción 3:** En los componentes, reemplazar los `setError` y `setMessage` por `toast.error(...)` y `toast.success(...)` para una mejor UX.

- [ ] **Tarea 3.2: Redirección automática tras éxito.**
    - **Acción:** En `ResetPasswordForm.tsx`, usar el `useRouter` para redirigir al usuario al login tras un cambio de contraseña exitoso.
    - **Contenido a añadir dentro del `useEffect` de `ResetPasswordForm.tsx` (o en un `useEffect` nuevo):**
      ```tsx
      if (success) {
        setTimeout(() => {
          router.push('/login');
        }, 3000); // Redirige después de 3 segundos
      }
      ```