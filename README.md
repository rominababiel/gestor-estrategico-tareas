# Gestor de tareas

SPA de gestión de tareas con autenticación, persistencia por usuario en Cloud Firestore y envío de un resumen por email mediante AWS SES a través de una Vercel Function.

> Documentación en construcción. Se completa a medida que avanzan los hitos del proyecto.

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
