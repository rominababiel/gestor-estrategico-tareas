# Gestor estratégico de tareas

SPA de gestión de tareas con autenticación, persistencia por usuario en Cloud Firestore y envío de un resumen por email mediante AWS SES a través de una Vercel Function.

## Producción

https://gestor-estrategico-tareas-tan.vercel.app

## Objetivo del proyecto

**Gestor estratégico de tareas** es una aplicación web que MateCode, una startup que desarrolla aplicaciones para pequeñas empresas, construye para un cliente que necesita que sus empleados gestionen sus tareas diarias.

### Problemática

El cliente necesita que sus empleados gestionen sus tareas diarias de forma **organizada**, **persistente** (lo que se carga hoy sigue ahí mañana) y **accesible desde cualquier dispositivo**, ya sea la computadora de la oficina o el celular. Además, pide una solución rápida, escalable y apoyada en servicios administrados (BaaS), sin un servidor propio que mantener.

### Solución

Una SPA donde cada persona tiene su propia cuenta y sus propias tareas guardadas en la nube, sincronizadas en tiempo real entre dispositivos. Además, puede recibir por email un resumen del estado de sus tareas. Firebase resuelve la autenticación y la base de datos, una función serverless en Vercel envía los emails con AWS SES y la app está publicada con una URL pública.

### Casos de uso principales

1. **Registrarse e iniciar sesión** con email y contraseña o con Google, verificar el email y recuperar la contraseña si se olvida. La sesión se mantiene al recargar y `/tasks` solo es accesible con sesión iniciada.
2. **Cargar las tareas del día** con un título y una descripción opcional.
3. **Marcar como completadas** las tareas terminadas y ver el avance en la barra de progreso.
4. **Filtrar** para ver solo las pendientes o solo las completadas.
5. **Editar o eliminar** una tarea; antes de eliminar se pide confirmación.
6. **Continuar en otro dispositivo:** las tareas aparecen al instante en el celular o en otra computadora.
7. **Recibir un resumen por email** con el estado de todas las tareas.

### Alcance

- **Incluye:** cuentas individuales, gestión completa de tareas (crear, ver, editar, completar y eliminar), persistencia en la nube por usuario, sincronización en tiempo real, aviso sin conexión (los cambios se guardan al volver a conectarse), resumen por email y deploy público.
- **No incluye:** compartir tareas entre usuarios, fechas de vencimiento, prioridades ni roles. Mientras AWS SES esté en modo de prueba, el resumen por email solo se envía a direcciones verificadas.

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
│  ├─ pages/            Vistas (Login, Register, ForgotPassword, Tasks, NotFound)
│  ├─ components/       Componentes de UI reutilizables y por dominio
│  ├─ features/         Lógica de dominio pura (auth, tasks, email)
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

## Decisiones de arquitectura

- **Capas con responsabilidades separadas.** Las páginas componen componentes; los componentes reciben datos y callbacks; los hooks (`useAuth`, `useTasks`, `useSendSummary`) manejan el estado; `features/` agrupa la lógica de cada dominio: el contexto de sesión en `auth` y funciones puras (validaciones, filtros, mensajes de error) en `tasks` y `email`, sin dependencias de React ni Firebase; y `services/` es la única capa que habla con Firebase o con la API. Así la lógica se testea sin red y cambiar un proveedor afecta un solo lugar.
- **Estado de sesión con Context y un observador de Firebase.** `AuthProvider` se suscribe a los cambios de sesión de Firebase Auth y expone el usuario a toda la app. Mientras se resuelve la sesión inicial se muestra un loader, para evitar parpadeos o redirecciones incorrectas.
- **Rutas protegidas como componentes.** `ProtectedRoute` redirige al login sin sesión y recuerda la ruta pedida; `PublicOnlyRoute` evita volver a login o registro con sesión iniciada.
- **Tiempo real con `onSnapshot`.** `useTasks` se suscribe a las tareas del usuario y cancela la suscripción al desmontarse. La lista se actualiza sola en todas las pestañas sin recargar.
- **Seguridad en el servidor, no en el cliente.** Las reglas de Firestore garantizan que cada usuario solo acceda a sus tareas, aunque alguien modifique el frontend. El email se envía desde una Vercel Function porque las credenciales de AWS no pueden llegar al navegador.
- **El servidor decide el destinatario.** La función toma el email del token verificado y lee las tareas de Firestore por su cuenta; el frontend no puede elegir a quién se envía ni qué se envía.
- **Tipos de Firestore aislados.** `taskMapper` convierte los documentos al tipo `Task` de la app, para que ningún componente dependa de `Timestamp` u otros tipos de Firebase.
- **CSS Modules con variables globales.** Los estilos de cada componente quedan encapsulados y los colores, tipografía y espaciados salen de `styles/variables.css`. Diseño mobile-first con dos columnas desde 1024 px.

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

1. El frontend (`src/services/emailService.ts`) obtiene el ID token de Firebase del usuario con sesión iniciada y hace `POST /api/send-summary` con el header `Authorization: Bearer <token>`. No envía tareas ni destinatario.
2. La función (`api/send-summary.ts`) verifica el token con Firebase Admin SDK. Si falta o no es válido, responde `401`.
3. Exige que el email del token esté verificado (`403` si no), para no enviar emails a direcciones que el usuario no demostró que son suyas.
4. Lee las tareas del usuario desde Firestore con Admin SDK, filtrando por su `uid`. Si no tiene tareas, responde `400`.
5. Arma el email en HTML y texto plano (`api/_lib/summaryEmail.ts`) y lo envía con SES al email del token.
6. Responde `200` con `{ sentTo, taskCount }`. Si SES rechaza al destinatario por el modo sandbox responde `403`, si SES falla por otro motivo `502` y, ante cualquier otro error, `500`, siempre sin exponer detalles internos. Cualquier método que no sea `POST` recibe `405`.

El frontend traduce cada código de error a un mensaje en español y muestra el resultado debajo de la barra de progreso. Mientras se envía, el botón muestra "Enviando…" y queda deshabilitado; también está deshabilitado si no hay tareas.

### Probar la función en local

`npm run dev` levanta solo el frontend. Para incluir la función hay que usar la Vercel CLI:

```bash
npx vercel login
npx vercel link
npx vercel dev --local-config vercel.dev.json
```

`vercel.dev.json` es una configuración sin la regla de rewrite de `vercel.json`. En producción Vercel aplica esa regla solo cuando no existe un archivo con esa ruta, pero `vercel dev` la aplica antes y le devuelve `index.html` al navegador cuando pide los módulos de Vite. El servidor de desarrollo de Vite ya resuelve las rutas de la SPA por su cuenta.

### Modo sandbox de SES

La cuenta de SES está en modo sandbox: solo envía emails a direcciones verificadas en SES. Si el usuario con sesión iniciada tiene un email que no está verificado en SES, la función responde `403` y la app muestra el mensaje "Por ahora el envío solo está habilitado para emails autorizados."

Para habilitar un destinatario:

1. En la consola de AWS, región `us-east-1`, entrar a **Amazon SES → Configuración → Identidades → Crear identidad**.
2. Elegir **Dirección de correo electrónico**, ingresar el email y crear la identidad.
3. Abrir el email de verificación que envía AWS y hacer clic en el enlace.

A partir de ahí, ese usuario puede recibir su resumen desde la app.

El remitente es una dirección de Gmail verificada en SES. Como el email sale desde servidores de Amazon y no de Gmail, los proveedores de correo pueden enviarlo a spam. Marcarlo como "No es spam" hace que los siguientes lleguen a la bandeja de entrada. Para evitarlo de raíz habría que enviar desde un dominio propio verificado en SES, algo que la consigna no requiere.

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

Requisitos: Node.js 20.19 o superior, o 22.12 o superior (lo que exige Vite 8).

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
| `npm run format:check` | Verifica el formato sin modificar archivos               |
| `npm run typecheck`    | Chequeo de tipos                                         |
| `npm run test`         | Ejecuta los tests                                        |
| `npm run test:watch`   | Tests en modo watch                                      |
| `npm run verify:rules` | Verifica las reglas de Firestore con dos usuarios reales |

## Tests

Vitest con React Testing Library y jsdom. Los tests están en `tests/`:

- `unit/`: validaciones, filtros, mensajes de error, formateo de fechas, plantilla del email y el hook `useTasks` con Firestore mockeado.
- `components/`: formulario y lista de tareas, botón de resumen y `ProtectedRoute`.
- `api/`: la Vercel Function y el cliente de SES, con Firebase Admin y SES mockeados.
- `mocks/`: datos de prueba compartidos (tareas y usuario autenticado).

Incluyen casos de error y de borde: título vacío o demasiado largo, sesión inválida, usuario sin tareas, destinatario rechazado por SES y fallas de red.

## Deploy

La app está desplegada en Vercel, conectada al repositorio de GitHub: cada push a `main` genera un deploy de producción.

1. Importar el repositorio en Vercel. El preset **Vite** detecta el build (`npm run build`) y la salida (`dist`), y las funciones de `api/` se publican solas.
2. Cargar las variables de entorno en **Settings → Environment Variables**. Las `VITE_*` se usan en el build; las de Firebase Admin y SES solo en la función.
3. En Firebase Authentication, agregar el dominio de Vercel en **Settings → Authorized domains** para que funcione el login con Google.
4. `vercel.json` sirve `index.html` para cualquier ruta que no sea `/api/*`, para que las rutas de la SPA funcionen al recargar o entrar con un link directo.

Si se cambia una variable `VITE_*`, hay que volver a desplegar, porque su valor queda incluido en el build.

## Uso de IA

Desarrollé el proyecto con Claude Code como asistente: Claude escribió el código y yo lo guié, decidí y probé cada etapa en el navegador.

- **Cómo lo integré:** primero leí la consigna, la guía y la rúbrica, se las pasé como contexto y le pedí un plan por etapas, separando lo que pide la documentación de lo que proponía por su cuenta. Cada decisión que la documentación no definía me la consultó, y al terminar cada etapa probé la app y le avisé lo que no funcionaba o no me gustaba.
- **Dónde fue más efectiva:** para confirmar que había entendido bien la documentación, para explicarme errores que no habría resuelto sola (como la contraseña que se perdía al entrar con Google) y para configurar Firebase, AWS y Vercel paso a paso.
- **Buenas prácticas que descubrí:** leer la documentación yo primero y usar la IA para contrastarla, pedir el plan antes que el código, pedir explicaciones en palabras simples para poder defender cada decisión, probar la app yo misma y no pegar nunca claves en el chat.

El detalle completo, con los prompts principales y las decisiones de cada etapa, está en [docs/AI_USAGE.md](docs/AI_USAGE.md).
