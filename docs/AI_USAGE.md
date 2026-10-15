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

## Patrones de uso que me resultaron efectivos

- Pedir primero el análisis y el plan, y validar antes de generar código.
- Pedir que distinga lo que exige la consigna de lo que es una propuesta propia.
- Revisar cada hito con su checklist de verificación antes de avanzar.
