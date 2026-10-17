# Uso de IA en el proyecto

Utilicé Claude Code como asistente de desarrollo. Mi forma de trabajo fue pedirle que leyera la documentación del proyecto (consigna, guía y rúbrica), armara un plan técnico, que yo lo revisara y aprobara, y recién después lo ejecutara hito por hito, consultándome cada decisión que la documentación no definía.

## Planificación

- Le pedí analizar la consigna, la guía de desarrollo y la rúbrica antes de escribir código.
- Detectó inconsistencias en el material: secciones de la guía que correspondían a otro proyecto y la carpeta `functions/` sugerida, que Vercel no reconoce como Functions en un proyecto Vite.
- Separamos qué decisiones definía la documentación y cuáles quedaban abiertas. Las abiertas las decidí yo a partir de las alternativas propuestas.

### Decisiones tomadas

| Tema                   | Decisión                                         | Motivo                                                        |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| Funciones serverless   | Carpeta `api/`                                   | Convención de Vercel para detectar Functions                  |
| Routing                | `react-router-dom`                               | Estándar para SPA en React, maneja el historial del navegador |
| Estilos                | CSS Modules, mobile-first                        | Sin dependencias extra, estilos aislados por componente       |
| Validación             | Funciones propias en `utils/`                    | Fáciles de testear de forma unitaria                          |
| Autenticación          | Email/contraseña y Google                        | Cubre ambas opciones de la consigna                           |
| Modelo en Firestore    | Colección `tasks` con campo `userId`             | La consigna pide filtrar por `userId`                         |
| Seguridad del endpoint | Verificación del token de Firebase en la función | Evita que terceros usen el endpoint para enviar emails        |
| Extras                 | Filtros por estado                               | Aporta valor sin sumar complejidad innecesaria                |

## Registro por hito

### Hito 1: Setup inicial

- Generé el proyecto con la plantilla oficial de Vite para React + TypeScript.
- Definí la estructura de carpetas por capas y configuré ESLint, Prettier, Vitest y las variables de entorno.
- La plantilla de Vite trae oxlint; elegí reemplazarlo por ESLint por ser el estándar más difundido en el ecosistema React.
- Verifiqué que `.env` quedara en `.gitignore` antes del primer commit.

### Hito 2: Configuración de Firebase

- Creé el proyecto en Firebase siguiendo los pasos que le pedí: edición Estándar de Firestore (la única que admite `onSnapshot`) en modo producción, para que la base arranque cerrada.
- Separé la inicialización en tres módulos: `app.ts` (lee y valida las variables de entorno), `auth.ts` y `firestore.ts`, para distinguir dónde se inicializa cada servicio.
- Tipé las variables `VITE_` en `vite-env.d.ts` para que TypeScript detecte nombres mal escritos.
- Verifiqué la conexión contra las APIs de Firebase: Authentication rechazó credenciales inexistentes y Firestore respondió `PERMISSION_DENIED`, lo que confirma que la base existe y está protegida.

### Hito 3: Autenticación

- Le pedí que la sesión se gestionara con `onAuthStateChanged` (patrón Observer) dentro de un `AuthProvider`, y que el resto de la app accediera a ella solo a través del hook `useAuth`.
- Los componentes no importan Firebase: `authService` es la única capa que conoce el SDK y convierte el `User` de Firebase en un tipo propio, `AuthUser`.
- Los códigos de error de Firebase se traducen a mensajes en español en `authErrorMessages.ts`, una función pura que se puede testear sin Firebase.
- Revisé que la validación de los formularios viviera en `utils/validators.ts` y que el estado de los formularios se manejara con un hook reutilizable, `useForm`, que también voy a usar para el formulario de tareas.
- TypeScript rechazó usar `interface` para los valores de los formularios con un tipo genérico `Record<string, string>`. Entendí que las interfaces no tienen firma de índice implícita y los definí como `type`.

### Hito 4: Rutas protegidas

- `ProtectedRoute` y `PublicOnlyRoute` envuelven las vistas mediante `children` y deciden si se muestran o se redirige.
- Mientras Firebase resuelve el estado inicial de la sesión, ambas muestran un loader en lugar de redirigir, para evitar redirecciones prematuras y parpadeos.
- La ruta que el usuario intentaba abrir viaja en el `state` de la navegación y se valida con `getRedirectPath` antes de usarla.
- Al mover las redirecciones a las rutas, las páginas de login y registro y el logout dejaron de navegar por su cuenta: solo cambian el estado de la sesión y las rutas reaccionan a ese cambio.
- Al probar, detecté que una cuenta creada con Google no puede iniciar sesión con contraseña ni volver a registrarse. Consulté por qué y entendí que Firebase lo bloquea porque elegir una contraseña no prueba que el email sea propio. Decidí no agregar recuperación de contraseña, que excede la consigna, y en cambio aclarar los mensajes de error para orientar al usuario a usar Google.

### Hito 5: Modelo de datos y seguridad

- Definí primero los campos de una tarea, su tipo y si son obligatorios, y a partir de esa definición se escribieron la interfaz `Task` y las reglas de Firestore, con los mismos límites en los dos lugares.
- Elegí publicar las reglas con la Firebase CLI para que queden versionadas en el repositorio en lugar de editarlas a mano en la consola.
- Las fechas `createdAt` y `updatedAt` las asigna el servidor, y las reglas lo exigen, para que un cliente no pueda falsearlas.
- Pedí una prueba explícita con dos usuarios reales: B no pudo leer, listar, editar ni borrar las tareas de A, ni crear tareas a su nombre. Los usuarios y datos de prueba se eliminaron al terminar.

### Hito 6: CRUD de tareas

- Las tareas se escuchan en tiempo real con `onSnapshot`, y la suscripción se cancela al desmontar el componente o al cambiar de usuario para no dejar listeners abiertos.
- Un mismo `TodoForm` sirve para crear y editar, y cada acción de una tarea (completar, editar, eliminar) tiene su propio estado de carga y de error.
- Agregué filtros por estado (todas, pendientes, completadas) con su contador.
- Al probar, eliminar borraba sin preguntar. Pedí una confirmación y elegí que fuera un modal, que quedó como componente reutilizable (`ConfirmDialog`) basado en el elemento nativo `<dialog>`.
- Al probar con dos pestañas, la segunda tardaba en actualizarse. Entendí que el navegador limita las pestañas que no están a la vista.
- Volví sobre el problema del login: una cuenta registrada con contraseña la pierde si después se entra con Google con el mismo email. Aunque la consigna no lo pide, decidí agregar verificación del email al registrarse, para que Firebase conserve la contraseña al vincular Google, y recuperación de contraseña, porque considero que un login sin recuperación queda incompleto.

## Patrones de uso que me resultaron efectivos

- Pedir primero el análisis y el plan, y validar antes de generar código.
- Pedir que distinga lo que exige la consigna de lo que es una propuesta propia.
- Revisar cada hito con su checklist de verificación antes de avanzar.
