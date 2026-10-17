# Uso de IA en el proyecto

Desarrollé el proyecto con Claude Code como asistente. Claude escribió el código y yo lo guié: le pedí que leyera toda la documentación del proyecto, armara un plan por etapas, me consultara cada decisión que la documentación no definía y me explicara lo que no entendía. Yo probé cada etapa en el navegador antes de avanzar y le marqué lo que no funcionaba o no me gustaba.

## Cómo integré la IA en mi forma de trabajo

1. **Primero la documentación.** Antes de escribir código, le pedí que leyera la consigna, la guía y la rúbrica y que separara lo que pide la documentación de lo que proponía por su cuenta.
2. **Un plan por etapas.** El desarrollo se dividió en los hitos que propone la guía: configuración, Firebase, autenticación, rutas protegidas, modelo de datos, tareas, email, tests y deploy.
3. **Decisiones consultadas.** Cada vez que había más de una opción, Claude me explicaba las alternativas y yo elegía.
4. **Prueba manual en cada etapa.** Al terminar cada hito probé la app y le conté lo que encontraba. Varias mejoras salieron de esas pruebas.
5. **Revisión final contra la consigna.** Le pedí que verificara con varios agentes en paralelo si cumplíamos cada criterio de la documentación.

## Prompts principales

Estos son mis pedidos más importantes, resumidos con mis palabras.

**1. "Leé toda la documentación del proyecto (consigna, guía y rúbrica) y armá un plan de desarrollo por etapas. No tomes decisiones sin consultarme y separá lo que pide la documentación de lo que proponés vos."**

- _Cómo influyó:_ Claude armó el plan por hitos y detectó que parte de la guía correspondía a otro proyecto (un chat con un personaje), que no tuvimos en cuenta.
- _Qué decidí:_ aprobé el plan y elegí entre las opciones que la documentación dejaba abiertas (ver "Decisiones que tomé").

**2. "¿Qué dice la documentación del proyecto sobre esto? Antes de elegir, decime qué pide la consigna."**

- _Cómo influyó:_ lo pregunté muchas veces, por ejemplo sobre el linter (la herramienta que revisa el código en busca de errores) y sobre el nombre del proyecto en Firebase. Así supe qué estaba definido y qué podía elegir.
- _Qué decidí:_ como la documentación no definía el linter, elegí ESLint, el más usado en proyectos React.

**3. "Quiero que se pueda ingresar con Google y también de forma manual con email y contraseña."**

- _Cómo influyó:_ Claude me explicó que la sesión se mantiene con una función de Firebase, `onAuthStateChanged`, que avisa a la app cada vez que el usuario entra o sale (el patrón Observer: la app escucha y Firebase avisa). Por eso la sesión no se pierde al recargar la página.
- _Qué decidí:_ que los errores se muestren con mensajes claros en español y no con los códigos de Firebase.

**4. "Asegurate de que las tareas de cada usuario se guarden o se borren solo en su cuenta, sin que afecten a otra cuenta."**

- _Cómo influyó:_ Claude escribió las reglas de seguridad de Firestore (las reglas que decide quién puede leer o modificar cada dato) para que cada usuario solo acceda a sus propias tareas. Las probó con dos usuarios de prueba: el segundo no pudo ver, editar ni borrar las tareas del primero.
- _Qué decidí:_ sumar esa prueba al repositorio (`npm run verify:rules`) para poder repetirla cuando quiera.

**5. "Me registré con contraseña y después entré con Google, y ahora la contraseña no funciona. ¿Por qué pasa y qué opciones tengo?"**

- _Cómo influyó:_ Claude me explicó que Firebase borra la contraseña si el email no fue verificado y después se entra con Google, porque registrarse con contraseña no prueba que el email sea de uno.
- _Qué decidí:_ aunque la consigna no lo pide, agregué la verificación del email al registrarse y la recuperación de contraseña, porque un login sin recuperación me parece incompleto.

**6. "La segunda pestaña tarda en actualizarse. ¿Es un error de la app o del navegador?"**

- _Cómo influyó:_ Claude me explicó que el navegador frena las pestañas que no están a la vista, y que con dos ventanas visibles a la vez la actualización debería ser inmediata.
- _Qué decidí:_ no cambiar nada, porque no era un error de la app.

**7. "Pasame textual lo que dice la documentación sobre el registro y el login."**

- _Cómo influyó:_ confirmé que la consigna pide registro con email y contraseña "y/o" con Google, y que no menciona la recuperación de contraseña.
- _Qué decidí:_ tratar la recuperación y la verificación del email como extras propios.

**8. "Lanzá varios agentes para verificar si cumplimos 1:1 con cada criterio del proyecto, sin ir en contra de lo especificado."**

- _Cómo influyó:_ cuatro agentes revisaron por separado la autenticación, las tareas, el email y deploy, y los tests y la documentación. Confirmaron que lo hecho cumplía y marcaron lo pendiente y algunas mejoras, como avisar cuando no hay conexión.
- _Qué decidí:_ agregar el aviso sin conexión, cambiar el favicon de la plantilla y sumar casos a la prueba de reglas.

**9. "Armá un brief técnico del proyecto para pasárselo a Claude Design."**

- _Cómo influyó:_ Claude armó un documento con las pantallas, los estados y los componentes de la app. Con ese documento, Claude Design propuso el sistema de diseño "Equilibrio".
- _Qué decidí:_ aplicar el diseño completo, incluidos los agregados que no contradecían la consigna: barra de progreso, textos en los botones mientras cargan y botón para reintentar si fallan las tareas.

**10. "La versión de escritorio no me gusta cómo se presenta, no se ve funcional."**

- _Cómo influyó:_ Claude me propuso tres opciones: dos columnas, una columna más ancha o dejarlo como estaba.
- _Qué decidí:_ dos columnas, para poder crear tareas sin perder de vista la lista.

## Decisiones que tomé

| Tema                     | Qué elegí                                      | Por qué                                                                   |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------- |
| Carpeta de funciones     | `api/` en lugar de `functions/`                | Vercel solo reconoce `api/` como funciones serverless en un proyecto Vite |
| Linter                   | ESLint                                         | La documentación no lo define y es el más usado en React                  |
| Navegación entre páginas | `react-router-dom`                             | Es la librería estándar en React y maneja el botón atrás del navegador    |
| Estilos                  | CSS Modules, pensado primero para celular      | No suma librerías y los estilos de cada componente quedan separados       |
| Ingreso                  | Email y contraseña, y Google                   | La consigna permite cualquiera de los dos; quise ofrecer ambos            |
| Reglas de Firestore      | Publicarlas desde el repositorio               | Quedan guardadas en el proyecto en lugar de editarse a mano en la consola |
| Eliminar una tarea       | Pedir confirmación en un modal                 | Al probar, borrar sin preguntar me pareció riesgoso                       |
| Extras                   | Filtros, progreso, verificación y recuperación | Suman a la experiencia sin contradecir la consigna                        |
| Email de resumen         | Solo se envía al email del usuario logueado    | Evita que alguien use la app para mandar emails a otras personas          |

## Registro por etapa

### Hito 1: Configuración inicial

- Claude creó el proyecto con Vite (la herramienta que arma y ejecuta proyectos de React) y organizó las carpetas por responsabilidad: páginas, componentes, servicios, hooks y tipos.
- Revisé que el archivo `.env`, donde van las claves, quedara fuera del repositorio antes del primer commit.

### Hito 2: Firebase

- Creé el proyecto en Firebase siguiendo los pasos que me indicó Claude y copié las claves en el `.env`, sin pegarlas en el chat.
- Siguiendo la recomendación de Claude, creé la base de datos en modo producción, para que arranque cerrada y nadie pueda leerla sin permiso.

### Hito 3: Autenticación

- Probé registrarme, iniciar sesión con email y con Google, recargar la página y cerrar sesión. Todo funcionó.

### Hito 4: Rutas protegidas

- Probé entrar a `/tasks` sin sesión y la app me mandó al login.
- Al probar con mi cuenta de Google encontré el problema de la contraseña del prompt 5.

### Hito 5: Modelo de datos y seguridad

- Claude definió qué datos tiene cada tarea (título, descripción, si está completada y las fechas) y las reglas que impiden acceder a tareas ajenas.
- Revisé el resultado de la prueba con dos usuarios: todos los accesos indebidos fueron rechazados.

### Hito 6: Tareas

- Probé crear, editar, completar, filtrar y eliminar tareas, y ver los cambios en dos pestañas a la vez.
- De esas pruebas salieron la confirmación al eliminar y la verificación del email con recuperación de contraseña.

### Diseño de la interfaz

- Pasé el brief a Claude Design y Claude aplicó el diseño en todos los componentes, sin sumar librerías.
- Al verlo en escritorio pedí un cambio de presentación, que terminó en el layout de dos columnas.

## En qué situaciones fue más efectiva

- **Entender la documentación:** separar lo obligatorio de lo opcional y detectar las partes que eran de otro proyecto.
- **Explicar errores:** el caso de la contraseña y Google lo entendí gracias a la explicación, no lo habría resuelto sola.
- **Configurar servicios:** Firebase y Vercel tienen muchos pasos, y seguirlos de a uno con Claude evitó errores.
- **Revisar el trabajo:** los agentes en paralelo encontraron detalles que yo no había visto, como el problema sin conexión.

## Patrones y buenas prácticas que descubrí

- Pedir el plan antes que el código y aprobarlo antes de empezar.
- Preguntar siempre qué dice la documentación antes de elegir algo.
- Pedir que me explique en palabras simples lo que no entiendo, para poder defender cada decisión.
- Probar la app yo misma al final de cada etapa: las mejores mejoras salieron de usarla.
- No pegar nunca claves ni contraseñas en el chat; se cargan directamente en el `.env` y en Vercel.
