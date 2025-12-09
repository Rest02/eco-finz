# Plan de Implementación Frontend: Recuperar Contraseña

> **Contexto de la Funcionalidad:**
> Este documento detalla los pasos y componentes necesarios en el frontend para implementar el flujo de recuperación de contraseña. El objetivo es crear una experiencia de usuario clara y segura que se integre con los endpoints del backend ya creados.

---

### **Resumen de Endpoints del Backend**

#### 1. Solicitar Restablecimiento
*   **Petición:** `POST : http://localhost:3001/auth/forgot-password`
*   **Body:**
    ```json
    {
      "email": "correo_del_usuario@ejemplo.com"
    }
    ```

#### 2. Restablecer la Contraseña
*   **Petición:** `POST : http://localhost:3001/auth/reset-password`
*   **Body:**
    ```json
    {
      "token": "el_token_obtenido_de_la_url",
      "password": "la_nueva_contraseña_del_usuario"
    }
    ```

---

### **Tecnologías y Supuestos**

*   **Framework:** Next.js
*   **Cliente HTTP:** Axios
*   **URL del Backend:** Se obtiene de la variable de entorno `process.env.NEXT_PUBLIC_API_URL`.
*   **Gestión de Estado:** Se pueden usar hooks de React (`useState`, `useEffect`) para el estado local. Para una gestión más compleja o compartida, se podría usar React Context o Zustand.
*   **UI y Estilos:** A discreción del desarrollador, siguiendo las convenciones del proyecto existente.
*   **Notificaciones:** Se recomienda una librería como `react-hot-toast` para mostrar mensajes de éxito/error al usuario de forma no intrusiva.

---

## Flujo y Componentes

El flujo se divide en dos páginas/vistas principales.

### Página 1: Solicitar Restablecimiento (`/auth/forgot-password`)

Esta página contendrá un formulario para que el usuario ingrese su correo electrónico y solicite el enlace de restablecimiento.

#### **UI y Componentes:**
*   Un campo de entrada (`<input>`) para el **email**.
*   Un botón de envío (`<button>`) con el texto "Enviar enlace de recuperación".
*   Un área para mostrar mensajes de éxito o error.
*   (Opcional) Un indicador de carga (spinner) que se muestra mientras la petición está en curso.

#### **Lógica y Estado (React Hooks):**
```jsx
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState(''); // Para mensajes de éxito o error
```

#### **Operación: Petición con Axios**
Al enviar el formulario, se ejecuta una función que realiza la llamada a la API.

```javascript
import axios from 'axios';
import { useState } from 'react';

// ... dentro de tu componente de página

const handleForgotPassword = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      { email }
    );
    
    // Mostramos el mensaje genérico de éxito que nos da el backend
    setMessage(response.data.message);

  } catch (error) {
    // Incluso si hay un error, por seguridad, podríamos querer mostrar el mismo mensaje genérico.
    // Opcionalmente, puedes manejar errores específicos si lo deseas.
    const errorMessage = error.response?.data?.message || 'Ocurrió un error.';
    setMessage(errorMessage); // O el mensaje genérico para más seguridad
  } finally {
    setLoading(false);
  }
};
```

---

### Página 2: Restablecer la Contraseña (`/auth/reset-password`)

Esta página lee el token de la URL y muestra un formulario para que el usuario establezca su nueva contraseña.

#### **UI y Componentes:**
*   Un campo de entrada (`<input type="password">`) para la **nueva contraseña**.
*   Un campo de entrada (`<input type="password">`) para **confirmar la nueva contraseña**.
*   Un botón de envío (`<button>`) con el texto "Cambiar Contraseña".
*   Un área para mostrar mensajes.
*   Tras un cambio exitoso, se puede mostrar un mensaje y un enlace para ir a la página de login.

#### **Lógica y Estado (React Hooks):**

Primero, necesitamos obtener el token de la URL. En Next.js, puedes usar el hook `useSearchParams`.

```jsx
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// ... dentro de tu componente de página

const searchParams = useSearchParams();
const [token, setToken] = useState(null);
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);

useEffect(() => {
  const tokenFromUrl = searchParams.get('token');
  if (tokenFromUrl) {
    setToken(tokenFromUrl);
  }
}, [searchParams]);
```

#### **Operación: Petición con Axios**
Al enviar el formulario, se valida que las contraseñas coincidan y luego se llama a la API.

```javascript
import axios from 'axios';

// ... dentro de tu componente de página

const handleResetPassword = async (e) => {
  e.preventDefault();
  
  if (password !== confirmPassword) {
    setError('Las contraseñas no coinciden.');
    return;
  }

  if (!token) {
    setError('Token no válido o no encontrado.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      { token, password }
    );
    
    setSuccess(true); // Para mostrar el mensaje de éxito y el enlace a login

  } catch (err) {
    const errorMessage = err.response?.data?.message || 'El token es inválido o ha expirado.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

### **Recomendación: Instancia de Axios centralizada**

Para evitar repetir la URL base en cada llamada, es una buena práctica crear una instancia de Axios.

Crea un archivo, por ejemplo, `lib/axios.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```
Y luego en tus componentes, puedes usarlo así:
```javascript
import api from '../lib/axios';

// ...
await api.post('/auth/reset-password', { token, password });
// ...
```