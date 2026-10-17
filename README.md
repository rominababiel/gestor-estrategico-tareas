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

Se probó con dos usuarios reales (A y B) contra las reglas publicadas, usando la API REST de Firestore. La prueba se puede repetir con `npm run verify:rules`: crea dos usuarios temporales, ejecuta los casos y elimina los usuarios y datos de prueba al terminar.

| Caso                                      | Resultado esperado | Resultado    |
| ----------------------------------------- | ------------------ | ------------ |
| A crea, lee, lista, edita y borra lo suyo | Permitido          | ✅ Permitido |
| B lee la tarea de A                       | Denegado           | ✅ Denegado  |
| B lista las tareas de A                   | Denegado           | ✅ Denegado  |
| B edita la tarea de A                     | Denegado           | ✅ Denegado  |
| B elimina la tarea de A                   | Denegado           | ✅ Denegado  |
| Sin sesión lee la tarea de A              | Denegado           | ✅ Denegado  |
| A lista todas las tareas sin filtrar      | Denegado           | ✅ Denegado  |
| A pasa su tarea a nombre de B             | Denegado           | ✅ Denegado  |
| B crea una tarea con el `userId` de A     | Denegado           | ✅ Denegado  |
| A crea una tarea con título vacío         | Denegado           | ✅ Denegado  |

## Flujo de envío de emails

El botón **Enviar resumen** de Mis tareas manda al usuario un email con todas sus tareas, usando AWS SES desde una Vercel Function. Las credenciales de AWS y de Firebase Admin viven solo en el servidor.

1. El frontend (`src/services/emailService.ts`) obtiene el ID token de Firebase del usuario logueado y hace `POST /api/send-summary` con el header `Authorization: Bearer <token>`. No envía tareas ni destinatario.
2. La función (`api/send-summary.ts`) verifica el token con Firebase Admin SDK. Si falta o no es válido, responde `401`.
3. Exige que el email del token esté verificado (`403` si no), para no enviar emails a direcciones que el usuario no demostró que son suyas.
4. Lee las tareas del usuario desde Firestore con Admin SDK, filtrando por su `uid`. Si no tiene tareas, responde `400`.
5. Arma el email en HTML y texto plano (`api/_lib/summaryEmail.ts`) y lo envía con SES al email del token.
6. Responde `200` con `{ sentTo, taskCount }`. Si SES falla responde `502` y, ante cualquier otro error, `500`, siempre sin exponer detalles internos.

El frontend traduce cada código de error a un mensaje en español y muestra el resultado debajo de la barra de progreso.

Mientras la cuenta de SES está en modo sandbox, solo se puede enviar a direcciones verificadas en SES. Para probar la función en local hay que usar `vercel dev`, porque `npm run dev` levanta solo el frontend.

## Variables de entorno

Se definen en `.env` para desarrollo local (ver `.env.example`) y en **Vercel → Settings → Environment Variables** para producción. Las variables con prefijo `VITE_` quedan incluidas en el bundle del navegador; el resto solo existe en el servidor.

| Variable                            | Dónde se usa | Descripción                                                          |
| ----------------------------------- | ------------ | -------------------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Frontend     | Configuración pública de la app web de Firebase                      |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Frontend     | Dominio de Firebase Authentication                                   |
| `VITE_FIREBASE_PROJECT_ID`          | Frontend     | ID del proyecto de Firebase                                          |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Frontend     | Bucket del proyecto                                                  |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Frontend     | ID de mensajería del proyecto                                        |
| `VITE_FIREBASE_APP_ID`              | Frontend     | ID de la app web                                                     |
| `FIREBASE_ADMIN_PROJECT_ID`         | Servidor     | ID del proyecto, tomado de la cuenta de servicio                     |
| `FIREBASE_ADMIN_CLIENT_EMAIL`       | Servidor     | Email de la cuenta de servicio de Firebase Admin                     |
| `FIREBASE_ADMIN_PRIVATE_KEY`        | Servidor     | Clave privada de la cuenta de servicio, con los `\n` tal como vienen |
| `SES_REGION`                        | Servidor     | Región de AWS donde está configurado SES (por ejemplo `us-east-1`)   |
| `SES_ACCESS_KEY_ID`                 | Servidor     | Access key del usuario IAM con permiso `ses:SendEmail`               |
| `SES_SECRET_ACCESS_KEY`             | Servidor     | Secret key de ese usuario IAM                                        |
| `SES_FROM_EMAIL`                    | Servidor     | Remitente verificado en SES                                          |

Las variables de SES no usan el prefijo `AWS_` porque Vercel reserva esos nombres.

## Instalación local

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env
npm run dev
```

Completar `.env` con las credenciales correspondientes (ver [Variables de entorno](#variables-de-entorno)). El archivo `.env` está excluido del repositorio.

## Scripts

| Script                 | Descripción                                              |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo                                   |
| `npm run build`        | Chequeo de tipos y build de producción                   |
| `npm run preview`      | Previsualiza el build                                    |
| `npm run lint`         | Linter (ESLint)                                          |
| `npm run format`       | Formatea el código con Prettier                          |
| `npm run typecheck`    | Chequeo de tipos                                         |
| `npm run test`         | Ejecuta los tests                                        |
| `npm run test:watch`   | Tests en modo watch                                      |
| `npm run verify:rules` | Verifica las reglas de Firestore con dos usuarios reales |

## Uso de IA

Ver [docs/AI_USAGE.md](docs/AI_USAGE.md).
