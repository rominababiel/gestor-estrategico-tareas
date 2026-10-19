# Uso de IA en el proyecto

Usé Claude Code como asistente durante todo el desarrollo. Leí la documentación del proyecto, se la pasé como contexto y trabajamos por etapas: Claude proponía e implementaba cada parte, me explicaba lo que no entendía y me consultaba cada decisión que la documentación no definía. Yo probé cada etapa en el navegador antes de avanzar y le avisé lo que no funcionaba o no me gustaba.

## Cómo integré la IA en mi forma de trabajo

1. **Primero la documentación.** Antes de escribir código, leí la consigna, la guía y la rúbrica, se las pasé a Claude y le pedí que separara lo que pide la documentación de lo que proponía por su cuenta.
2. **Un plan por etapas.** El desarrollo se dividió en los hitos que propone la guía: configuración, Firebase, autenticación, rutas protegidas, modelo de datos, tareas, email, tests y deploy.
3. **Decisiones consultadas.** Cada vez que había más de una opción, Claude me explicaba las alternativas y yo elegía.
4. **Prueba manual en cada etapa.** Al terminar cada hito probé la app y le conté lo que encontraba. Varias mejoras salieron de esas pruebas.
5. **Revisión final contra la consigna.** Le pedí que verificara con varios agentes en paralelo si cumplíamos cada criterio de la documentación.

## Prompts principales

Estos son los prompts más importantes que usé durante el desarrollo.

**1. "Estoy haciendo el proyecto integrador del módulo 4: un gestor de tareas con React, TypeScript, Firebase, AWS SES y Vercel. Ya leí la consigna, la guía y la rúbrica; te las paso para que las tengas como contexto. Armame un plan por etapas que cubra todo lo que piden. No tomes ninguna decisión sin consultarme y separame bien lo que pide la documentación de lo que proponés vos."**

- _Cómo influyó:_ Claude armó el plan por hitos. Una parte de la guía correspondía a otro proyecto (un chat con un personaje), así que no la tuvimos en cuenta.
- _Qué decidí:_ aprobé el plan y elegí entre las opciones que la documentación dejaba abiertas (ver "Decisiones que tomé").

**2. "Antes de elegir algo, recordame qué dice la documentación del proyecto sobre eso, para confirmar que lo entendí bien. Si no lo define, explicame las opciones en palabras simples y decime cuál conviene, pero la decisión la tomo yo."**

- _Cómo influyó:_ lo pregunté muchas veces, por ejemplo sobre el linter (la herramienta que revisa el código en busca de errores) y sobre el nombre del proyecto en Firebase. Así supe qué estaba definido y qué podía elegir.
- _Qué decidí:_ como la documentación no definía el linter, elegí ESLint, el más usado en proyectos React.

**3. "La consigna pide registro con email y contraseña y/o con Google. Quiero las dos: que se pueda entrar con Google y también de forma manual con email y contraseña. Que la sesión no se pierda al recargar la página y que los errores salgan en español, con mensajes que se entiendan y no con los códigos de Firebase."**

- _Cómo influyó:_ Claude me explicó que la sesión se mantiene con una función de Firebase, `onAuthStateChanged`, que avisa a la app cada vez que el usuario entra o sale (el patrón Observer: la app escucha y Firebase avisa). Por eso la sesión no se pierde al recargar la página.
- _Qué decidí:_ que los errores se muestren con mensajes claros en español y no con los códigos de Firebase.

**4. "Las tareas se guardan en Firestore y cada una tiene el id de su dueño. Quiero que las tareas de cada usuario se guarden, se editen y se borren solo en su cuenta, sin que afecten a otra. ¿Cómo me aseguro de que nadie pueda ver o tocar tareas ajenas? La base no puede quedar abierta en ningún momento. Probalo con dos cuentas para ver que funciona."**

- _Cómo influyó:_ Claude escribió las reglas de seguridad de Firestore (las reglas que decide quién puede leer o modificar cada dato) para que cada usuario solo acceda a sus propias tareas. Las probó con dos usuarios de prueba: el segundo no pudo ver, editar ni borrar las tareas del primero.
- _Qué decidí:_ sumar esa prueba al repositorio (`npm run verify:rules`) para poder repetirla cuando quiera.

**5. "Me registré con email y contraseña y después entré con Google con el mismo email. Ahora, cuando intento entrar con email y contraseña, me aparece 'El email o la contraseña son incorrectos.', pero la contraseña es la que creé; solo puedo entrar con Google. Además no hay forma de recuperar la contraseña, y eso en un login no está bien. ¿Por qué pasa y qué podemos hacer?"**

- _Cómo influyó:_ Claude me explicó que Firebase borra la contraseña si el email no fue verificado y después se entra con Google, porque registrarse con contraseña no prueba que el email sea de uno.
- _Qué decidí:_ aunque la consigna no lo pide, agregué la verificación del email al registrarse y la recuperación de contraseña, porque un login sin recuperación me parece incompleto.

**6. "Probé el tiempo real: dupliqué la pestaña, creé una tarea en una y en la otra recién apareció al minuto, no fue instantáneo. Lo demás funciona. ¿Es un error de la app o del navegador?"**

- _Cómo influyó:_ Claude me explicó que el navegador frena las pestañas que no están a la vista, y que con dos ventanas visibles a la vez la actualización debería ser inmediata.
- _Qué decidí:_ no cambiar nada, porque no era un error de la app.

**7. "Leyendo la consigna no me quedó claro si la recuperación de contraseña es obligatoria. Citame la parte que habla del registro y el login, así confirmo qué es obligatorio y qué sería un extra."**

- _Cómo influyó:_ confirmé que la consigna pide registro con email y contraseña "y/o" con Google, y que no menciona la recuperación de contraseña.
- _Qué decidí:_ tratar la recuperación y la verificación del email como extras propios.

**8. "Lanzá varios agentes para revisar si cumplimos 1:1 con cada criterio del proyecto. Los extras que elegí están bien siempre que no vayan en contra de lo que pide la consigna. Decime qué falta y qué se podría mejorar."**

- _Cómo influyó:_ cuatro agentes revisaron por separado la autenticación, las tareas, el email y deploy, y los tests y la documentación. Confirmaron que lo hecho cumplía y marcaron lo pendiente y algunas mejoras, como avisar cuando no hay conexión.
- _Qué decidí:_ agregar el aviso sin conexión, cambiar el favicon de la plantilla y sumar casos a la prueba de reglas.

**9. "Armame un brief técnico del proyecto para pasárselo a Claude Design: qué pantallas tiene, qué muestra cada una cuando carga, cuando hay un error o cuando está vacía, y qué componentes usa. La idea es que proponga un diseño sin cambiar cómo funciona la app."**

- _Cómo influyó:_ Claude armó un documento con las pantallas, los estados y los componentes de la app. Con ese documento, Claude Design propuso el sistema de diseño "Equilibrio".
- _Qué decidí:_ aplicar el diseño completo, incluidos los agregados que no contradecían la consigna: barra de progreso, textos en los botones mientras cargan y botón para reintentar si fallan las tareas.

**10. "La página de Mis tareas está hecha con CSS Modules y pensada primero para celular, pero la versión de escritorio no me gusta cómo se presenta: en pantalla grande queda muy vacía y no se ve funcional. Proponeme opciones para aprovechar mejor el espacio, sin tocar las funcionalidades, y yo elijo."**

- _Cómo influyó:_ Claude me propuso tres opciones: dos columnas, una columna más ancha o dejarlo como estaba.
- _Qué decidí:_ dos columnas, para poder crear tareas sin perder de vista la lista.

**11. "En la guía leí que en modo de prueba SES solo envía a emails verificados. Si alguien prueba la app con un email que no está verificado, ¿le va a dar error? ¿Hace falta salir de ese modo? Recordame qué dice la documentación y qué opciones tengo, y no hagas nada que haya que pagar sin preguntarme."**

- _Cómo influyó:_ Claude me explicó que AWS SES arranca en modo de prueba (sandbox) y solo envía a emails verificados, y que para salir de ese modo hay que pedirle acceso a producción a AWS, algo que la consola solo permite con un dominio propio verificado. Me citó la parte de la guía que dice que en sandbox SES solo envía a emails verificados, y así confirmé que la consigna contempla ese modo y no pide salir de él.
- _Qué decidí:_ quedarme en modo de prueba, donde el resumen solo se envía a emails verificados en SES, explicarlo en el README y mostrar un mensaje claro si alguien con un email no verificado intenta enviarlo.

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
| Modo de prueba de SES    | Quedarme en sandbox y verificar destinatarios  | La guía lo contempla y salir de ese modo requiere un dominio propio       |
| Botón "Eliminar"         | Texto en lugar de ícono                        | Se entiende sin adivinar y la documentación no define cómo debe verse     |

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

### Hito 7: Email con AWS SES

- Claude escribió la función que envía el resumen y yo configuré AWS siguiendo sus pasos: verifiqué mi email en SES, creé un usuario con permiso solo para enviar emails y copié sus claves directamente en el `.env`.
- Crear la cuenta de AWS me costó: en Safari la página me mandaba del login a "crear proyecto" y de vuelta al login. Cambié a Chrome y funcionó.
- Probé el botón en mi computadora con mi Gmail y el email llegó con mis tareas. Con mi otro email dio error, y así entendí lo del modo de prueba (prompt 11).

### Hito 8: Tests

- Claude escribió los tests de las validaciones, los filtros, los componentes principales y la función de email, incluidos casos de error.
- Revisé qué probaba cada test antes de darlos por buenos.

### Hito 9: Deploy y revisión final

- Al publicar, la función de email fallaba en Vercel aunque en mi computadora andaba. Claude revisó los registros de Vercel y encontró una librería incompatible con ese entorno; la solución fue usar una versión anterior.
- Después las tareas no cargaban en producción. Claude descubrió que una de las variables cargadas en Vercel tenía un error de tipeo (le faltaba una letra) y la corrigió.
- El email llegaba a spam. Claude me explicó que pasa porque sale desde servidores de Amazon con una dirección de Gmail; lo marqué como "No es spam" y pedí que quedara aclarado en el README.
- Probé todo en producción: login, crear y completar tareas y recibir el resumen.

## En qué situaciones fue más efectiva

- **Confirmar que entendí la documentación:** contrastar lo que yo había entendido sobre qué era obligatorio y qué era opcional.
- **Explicar errores:** el caso de la contraseña y Google lo entendí gracias a la explicación, no lo habría resuelto sola.
- **Configurar servicios:** Firebase y Vercel tienen muchos pasos, y seguirlos de a uno con Claude evitó errores.
- **Revisar el trabajo:** los agentes en paralelo encontraron detalles que yo no había visto, como el problema sin conexión.
- **Encontrar errores en producción:** cuando algo andaba en mi computadora pero no en Vercel, Claude revisó los registros y la configuración publicada hasta dar con la causa.

## Patrones y buenas prácticas que descubrí

- Pedir el plan antes que el código y aprobarlo antes de empezar.
- Leer la documentación yo primero y usar la IA para contrastarla y confirmar que la entendí, no para que la lea por mí.
- Preguntar siempre qué dice la documentación antes de elegir algo.
- Pedir que me explique en palabras simples lo que no entiendo, para poder defender cada decisión.
- Probar la app yo misma al final de cada etapa: las mejores mejoras salieron de usarla.
- No pegar nunca claves ni contraseñas en el chat; se cargan directamente en el `.env` y en Vercel.
