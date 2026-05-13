# 💰 Ecofinz - Sistema de Gestión Financiera Personal

Ecofinz es una aplicación web moderna para gestionar tus finanzas personales. Permite a los usuarios registrarse, autenticarse, controlar sus cuentas bancarias, registrar transacciones y analizar su situación financiera de forma intuitiva.

## 🎯 Características Principales

- **Autenticación Segura**: Registro, login y recuperación de contraseña con JWT
- **Gestión de Cuentas**: Crear y administrar múltiples cuentas bancarias
- **Registro de Transacciones**: Ingresos, egresos y ahorros categorizados
- **Múltiples Tipos de Cuentas**: Banco, efectivo, tarjeta de crédito, billetera digital
- **Análisis Financiero**: Resúmenes mensuales y presupuestos
- **Interfaz Responsiva**: Diseñado con Next.js y React
- **Base de Datos Robusta**: PostgreSQL con Prisma ORM

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Documentación Adicional](#documentación-adicional)

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Lenguaje de programación
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos (opcional)
- **React Context** - Gestión de estado

### Backend
- **NestJS 11** - Framework Node.js
- **TypeScript** - Lenguaje de programación
- **Prisma 7** - ORM y gestor de base de datos
- **PostgreSQL** - Base de datos
- **Passport.js** - Autenticación
- **JWT** - Tokens de autenticación
- **Nodemailer** - Envío de correos

## 📦 Requisitos Previos

- **Node.js** v18 o superior
- **npm** o **yarn**
- **PostgreSQL** 12 o superior
- **Git**

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ecofinz.git
cd ecofinz
```

### 2. Instalación del Servidor

```bash
cd ecofinz-server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Configurar la base de datos en .env
# DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ecofinz"
# JWT_SECRET="tu-super-secreto-seguro"
# EMAIL_USER="tu-email@gmail.com"
# EMAIL_PASSWORD="tu-contraseña-app"

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Llenar base de datos con datos de ejemplo
npx prisma db seed
```

### 3. Instalación del Cliente

```bash
cd ecofinz-client

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Configurar la URL del API backend
# NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## ⚙️ Configuración

### Variables de Entorno - Backend (`.env`)

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ecofinz"

# JWT
JWT_SECRET="tu-secreto-super-seguro-aqui"
JWT_EXPIRATION="7d"

# Correo electrónico (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-contraseña-app"
EMAIL_FROM="noreply@ecofinz.com"

# Puerto del servidor
PORT=3001
NODE_ENV=development
```

### Variables de Entorno - Frontend (`.env.local`)

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Otros
NEXT_PUBLIC_APP_NAME=Ecofinz
```

## 🏃 Ejecución

### Desarrollo

#### Terminal 1 - Backend
```bash
cd ecofinz-server
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3001`

#### Terminal 2 - Frontend
```bash
cd ecofinz-client
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

### Producción

#### Backend
```bash
cd ecofinz-server
npm run build
npm run start:prod
```

#### Frontend
```bash
cd ecofinz-client
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
ecofinz/
├── ecofinz-client/          # Aplicación Frontend (Next.js)
│   ├── src/
│   │   ├── app/             # Páginas y layouts
│   │   ├── components/      # Componentes React
│   │   ├── context/         # Context API
│   │   ├── lib/             # Utilidades y configuración
│   │   ├── services/        # Llamadas a API
│   │   └── types/           # Tipos TypeScript
│   ├── public/              # Archivos estáticos
│   └── package.json
│
├── ecofinz-server/          # Aplicación Backend (NestJS)
│   ├── src/
│   │   ├── app.module.ts    # Módulo principal
│   │   ├── auth/            # Módulo de autenticación
│   │   ├── email/           # Servicio de correos
│   │   ├── finance/         # Módulo de finanzas
│   │   ├── users/           # Módulo de usuarios
│   │   ├── prisma/          # Configuración de Prisma
│   │   └── main.ts          # Archivo de entrada
│   ├── prisma/
│   │   ├── schema.prisma    # Esquema de la base de datos
│   │   └── migrations/      # Migraciones de la BD
│   ├── docs/                # Documentación del proyecto
│   └── package.json
│
└── README.md                # Este archivo
```

## 🔐 Autenticación

La aplicación utiliza **JWT (JSON Web Tokens)** para la autenticación:

1. El usuario se registra con email y contraseña
2. Se envía un PIN de verificación al correo
3. Tras verificar el PIN, puede iniciar sesión
4. El servidor genera un JWT válido por 7 días
5. El cliente almacena el token y lo envía en cada request



## 📞 Soporte

Para reportar bugs o sugerir mejoras, abre un issue en el repositorio.

## 📄 Licencia

Este proyecto está bajo la licencia UNLICENSED.

---

**Última actualización**: 2 de enero de 2026



Vale ya me he dado cuenta del problema , lo que ocurre es que en una cuenta por ejemplo , el usuario puede tener sus ahorros. entonces , cuando en una cuenta el usuario realiza un movimiento de ingreso , no esta contabilizando como ahorro entonces por eso no se esta contabilizando en el componente , para esto hay que realizar un cambio , este cambio es que en las tarjetas de debito que ingrese el usuario tengan opción de ponerlas como cuenta de ahorro personal. 

---

- realicemos este cambio para la base de datos 
- realicemos este cambio en el componente y ajustemoslo 