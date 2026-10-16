# Gestor de tareas

SPA de gestión de tareas con autenticación, persistencia por usuario en Cloud Firestore y envío de un resumen por email mediante AWS SES a través de una Vercel Function.

> Documentación en construcción. Se completa a medida que avanzan los hitos del proyecto.

## Producción

https://gestor-estrategico-tareas-tan.vercel.app

## Stack

- React + TypeScript (Vite)
- Firebase Authentication + Cloud Firestore
- AWS SES desde Vercel Functions
- Vitest + React Testing Library
- Deploy en Vercel

## Estructura del proyecto

```
├─ api/                 Vercel Functions (envío de email con SES)
├─ src/
│  ├─ pages/            Vistas (Login, Register, Tasks)
│  ├─ components/       Componentes de UI reutilizables y por dominio
│  ├─ features/         Lógica de dominio pura (auth, tasks)
│  ├─ services/         Integraciones externas (Firebase, API)
│  ├─ routes/           Router y rutas protegidas
│  ├─ hooks/            Hooks de estado (useAuth, useTasks)
│  ├─ types/            Tipos e interfaces compartidas
│  ├─ utils/            Helpers (validaciones, formateo)
│  └─ styles/           Estilos globales y variables
├─ tests/               Tests unitarios, de componentes y mocks
└─ docs/                Documentación complementaria
```

La consigna sugiere `functions/` para las funciones serverless. Se usa `api/` porque es el único directorio que Vercel detecta automáticamente como Functions en un proyecto Vite.

## Modelo de datos

Las tareas se guardan en la colección `tasks` de Cloud Firestore. Cada documento incluye el `userId` de su dueño, y las consultas siempre filtran por ese campo.

```ts
interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

| Campo         | Tipo en Firestore | Regla                                        |
| ------------- | ----------------- | -------------------------------------------- |
| `userId`      | string            | Igual al `uid` del usuario autenticado       |
| `title`       | string            | Obligatorio, no vacío, máximo 100 caracteres |
| `description` | string            | Opcional, máximo 500 caracteres              |
| `completed`   | boolean           | Obligatorio                                  |
| `createdAt`   | timestamp         | Lo asigna el servidor y no se modifica       |
| `updatedAt`   | timestamp         | Lo asigna el servidor en cada cambio         |

`services/firebase/taskMapper.ts` convierte los `Timestamp` de Firestore a `Date`, de modo que el resto de la aplicación no depende de tipos de Firestore.

## Seguridad en Firestore

Las reglas están versionadas en [`firestore.rules`](firestore.rules) y se publican con la Firebase CLI:

```bash
npx firebase login
npx firebase deploy --only firestore:rules,firestore:indexes
```

- Un usuario solo puede leer, editar y eliminar documentos cuyo `userId` coincida con su `uid`.
- Al crear una tarea, el `userId` debe ser el propio: no se pueden crear tareas a nombre de otro usuario.
- Al editar, no se puede cambiar el dueño ni la fecha de creación.
- Se valida que el documento tenga exactamente los campos del modelo, con sus tipos y límites.
- Cualquier acceso sin sesión es rechazado.

### Verificación

Se probó con dos usuarios reales (A y B) contra las reglas publicadas, usando la API REST de Firestore:

| Caso                                      | Resultado esperado | Resultado    |
| ----------------------------------------- | ------------------ | ------------ |
| A crea, lee, lista, edita y borra lo suyo | Permitido          | ✅ Permitido |
| B lee la tarea de A                       | Denegado           | ✅ Denegado  |
| B lista las tareas de A                   | Denegado           | ✅ Denegado  |
| B edita la tarea de A                     | Denegado           | ✅ Denegado  |
| B elimina la tarea de A                   | Denegado           | ✅ Denegado  |
| Sin sesión lee la tarea de A              | Denegado           | ✅ Denegado  |
| B crea una tarea con el `userId` de A     | Denegado           | ✅ Denegado  |
| A crea una tarea con título vacío         | Denegado           | ✅ Denegado  |

## Instalación local

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env
npm run dev
```

Completar `.env` con las credenciales correspondientes. El archivo `.env` está excluido del repositorio.

## Scripts

| Script               | Descripción                            |
| -------------------- | -------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                 |
| `npm run build`      | Chequeo de tipos y build de producción |
| `npm run preview`    | Previsualiza el build                  |
| `npm run lint`       | Linter (ESLint)                        |
| `npm run format`     | Formatea el código con Prettier        |
| `npm run typecheck`  | Chequeo de tipos                       |
| `npm run test`       | Ejecuta los tests                      |
| `npm run test:watch` | Tests en modo watch                    |

## Uso de IA

Ver [docs/AI_USAGE.md](docs/AI_USAGE.md).
