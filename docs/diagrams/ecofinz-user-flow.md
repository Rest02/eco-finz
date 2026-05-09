# EcoFinz - Flujo de Usuario

Este diagrama de Mermaid representa el flujo completo que un usuario sigue al interactuar con la aplicación EcoFinz, desde el registro y autenticación, hasta la gestión de sus finanzas (cuentas, movimientos, presupuestos, categorías y resúmenes).

```mermaid
flowchart TD
    %% Estilos
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#000000;
    classDef start fill:#ffd43b,stroke:#e6b800,stroke-width:2px,color:#000000;
    classDef decision fill:#a5d8ff,stroke:#74c0fc,stroke-width:2px,color:#000000;
    classDef process fill:#b2f2bb,stroke:#8ce99a,stroke-width:2px,color:#000000;
    classDef endNode fill:#ffc9c9,stroke:#ffa8a8,stroke-width:2px,color:#000000;
    
    %% Flujo de Autenticación
    Start([Usuario abre EcoFinz]):::start --> CheckAuth{¿Sesión activa?}:::decision
    CheckAuth -->|No| AuthChoice{¿Tiene cuenta?}:::decision
    AuthChoice -->|No| Register[Registrar Usuario\nEmail + Password]:::process
    Register --> VerifyPIN[Verificar PIN enviado por Email]:::process
    VerifyPIN --> Login[Iniciar Sesión]:::process
    AuthChoice -->|Sí| Login
    Login --> JWT[Autenticación exitosa\nGenerar JWT]:::process
    JWT --> Dashboard
    
    CheckAuth -->|Sí| Dashboard[Dashboard Principal]:::start

    %% Dashboard - Menú Principal
    Dashboard --> MenuCuentas[Gestión de Cuentas]:::process
    Dashboard --> MenuTransac[Registro de Movimientos]:::process
    Dashboard --> MenuCategorias[Gestión de Categorías]:::process
    Dashboard --> MenuPresup[Gestión de Presupuestos]:::process
    Dashboard --> MenuResumen[Resumen Mensual]:::process

    %% Gestión de Cuentas
    MenuCuentas --> ListCuentas[Ver listado de cuentas]
    ListCuentas --> CreateCuenta[Crear Cuenta nueva\nBanco, Efectivo, Tarjeta, etc.]
    ListCuentas --> EditCuenta[Editar/Eliminar Cuenta]
    CreateCuenta --> Dashboard
    EditCuenta --> Dashboard

    %% Gestión de Categorías
    MenuCategorias --> ListCategorias[Ver Categorías]
    ListCategorias --> CreateCategoria[Crear/Editar Categoría\nIngreso, Egreso, Ahorro, etc.]
    CreateCategoria --> Dashboard

    %% Registro de Movimientos
    MenuTransac --> InitTransac[Registrar Nueva Transacción\nIngreso, Egreso, etc.]
    InitTransac --> SelectCuenta[Seleccionar Cuenta origen/destino]
    SelectCuenta --> SelectCategoria[Asignar Categoría]
    SelectCategoria --> ConfirmTransac[Confirmar Transacción]
    
    %% Impacto del Movimiento
    ConfirmTransac --> ImpactBalance[Actualiza Balance de la Cuenta]
    ConfirmTransac --> ImpactResumen[Actualiza Resumen Mensual]
    ConfirmTransac --> ImpactPresup[Consume Presupuesto\nsi existe para la categoría]
    
    ImpactBalance --> Dashboard
    ImpactResumen -.-> Dashboard
    ImpactPresup -.-> Dashboard

    %% Gestión de Presupuestos
    MenuPresup --> ListPresup[Ver Presupuestos del mes]
    ListPresup --> CreatePresup[Crear/Editar Presupuesto\nAsignado a Categoría]
    CreatePresup --> Dashboard

    %% Resumen Mensual
    MenuResumen --> VerAnalisis[Ver Análisis y Reportes\nIngresos vs Egresos]
    VerAnalisis --> Dashboard
    
    %% Logout
    Dashboard --> Logout([Cerrar Sesión]):::endNode
```
