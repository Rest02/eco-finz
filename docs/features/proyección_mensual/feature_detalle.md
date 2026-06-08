# 14. Gestión de Proyecciones Mensuales

## Objetivo

Permitir que cada proyección financiera creada por el usuario pueda almacenarse permanentemente en la base de datos para ser consultada, editada, actualizada o eliminada posteriormente.

La proyección no debe ser un cálculo temporal, sino un registro financiero histórico asociado a un período específico.

---

## Concepto

Cada vez que el usuario finalice una proyección, podrá guardarla.

Ejemplos:

* Proyección Mayo 2025
* Proyección Junio 2025
* Proyección Julio 2025

El usuario podrá tener múltiples proyecciones almacenadas a lo largo del tiempo.

---

## Información que debe almacenarse

Cada proyección debe guardar un snapshot completo de la información utilizada en el momento de su creación.

### Campos principales

| Campo                        | Descripción                    |
| ---------------------------- | ------------------------------ |
| Id                           | Identificador único            |
| Nombre                       | Nombre asignado por el usuario |
| Periodo                      | Mes y año de la proyección     |
| Fecha creación               | Auditoría                      |
| Fecha modificación           | Auditoría                      |
| Estado                       | Activa, Archivada o Eliminada  |
| Día de pago                  | Día definido por el usuario    |
| Total ingresos seleccionados | Monto calculado                |
| Total gastos fijos           | Monto calculado                |
| Total pago tarjetas          | Monto calculado                |
| Dinero disponible real       | Resultado calculado            |
| Porcentaje ahorro            | Valor configurado              |
| Porcentaje gastos variables  | Valor configurado              |
| Monto ahorro proyectado      | Resultado calculado            |
| Monto gastos variables       | Resultado calculado            |

---

## Snapshot de Ingresos

La proyección debe almacenar cuáles ingresos fueron seleccionados.

Ejemplo:

* Sueldo Empresa A
* Bono Productividad
* Trabajo Freelance

Esto permite reconstruir la proyección aunque posteriormente cambien los ingresos originales.

---

## Snapshot de Gastos Fijos

La proyección debe almacenar los gastos fijos utilizados al momento de generarse.

Ejemplo:

* Arriendo → $250.000
* Internet → $20.000
* Luz → $30.000

Esto evita que modificaciones futuras alteren una proyección histórica.

---

## Snapshot de Pagos de Tarjetas

La proyección debe almacenar el detalle de los pagos de tarjetas considerados.

Ejemplo:

* MACH → $20.000
* Banco Estado → $50.000

De esta forma se conserva el contexto histórico de la proyección.

---

## Operaciones Disponibles

### Crear Proyección

Permite guardar una nueva proyección.

Acción:

"Guardar Proyección"

---

### Visualizar Proyección

Permite abrir una proyección existente y revisar todos sus datos.

Acción:

"Ver Detalle"

---

### Editar Proyección

Permite modificar una proyección ya creada.

El usuario podrá:

* Cambiar ingresos seleccionados.
* Cambiar porcentajes.
* Cambiar gastos fijos.
* Cambiar día de pago.
* Actualizar cálculos.

Acción:

"Editar"

---

### Duplicar Proyección

Permite generar una nueva proyección basada en una existente.

Ejemplo:

Duplicar "Mayo 2025" para crear "Junio 2025".

Acción:

"Duplicar"

Esta funcionalidad acelera enormemente la planificación mensual.

---

### Eliminar Proyección

Permite eliminar una proyección.

Se recomienda utilizar Soft Delete.

Estados:

* Activa
* Archivada
* Eliminada

No se recomienda borrar físicamente registros históricos.

---

## Pantalla de Historial de Proyecciones

El módulo debe incluir una vista donde el usuario pueda consultar todas sus proyecciones.

### Información mostrada

| Periodo    | Disponible Real | Ahorro   | Estado |
| ---------- | --------------- | -------- | ------ |
| Mayo 2025  | $600.000        | $240.000 | Activa |
| Junio 2025 | $580.000        | $200.000 | Activa |
| Julio 2025 | $650.000        | $300.000 | Activa |

---

## Filtros

Permitir filtrar por:

* Mes.
* Año.
* Estado.
* Nombre de proyección.

---

## Comparación Histórica (Futuro)

En versiones futuras se podrá comparar:

* Proyección Mayo vs Junio.
* Evolución del ahorro.
* Evolución de gastos fijos.
* Evolución de deuda.
* Evolución del dinero disponible.

Esto transformará el módulo en una herramienta de planificación y análisis financiero histórico.
