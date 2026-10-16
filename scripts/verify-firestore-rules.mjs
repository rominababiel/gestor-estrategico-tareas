const KEY = process.env.VITE_FIREBASE_API_KEY;
const PID = process.env.VITE_FIREBASE_PROJECT_ID;

if (!KEY || !PID) {
  console.error('Faltan VITE_FIREBASE_API_KEY o VITE_FIREBASE_PROJECT_ID en .env');
  process.exit(1);
}
const AUTH = 'https://identitytoolkit.googleapis.com/v1/accounts';
const DB = `projects/${PID}/databases/(default)/documents`;
const FS = `https://firestore.googleapis.com/v1/${DB}`;

const results = [];
const check = (name, actual, expected) => {
  results.push({ name, actual, expected, ok: actual === expected });
};

async function signUp(label) {
  const email = `rules-test-${label}-${Date.now()}@example.com`;
  const res = await fetch(`${AUTH}:signUp?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Test123456!', returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`signUp ${label}: ${data.error?.message}`);
  return { uid: data.localId, token: data.idToken };
}

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

function taskFields(userId, title = 'Tarea de prueba') {
  return {
    userId: { stringValue: userId },
    title: { stringValue: title },
    description: { stringValue: 'Prueba de reglas' },
    completed: { booleanValue: false },
  };
}

async function createTask(token, docId, fields) {
  const res = await fetch(`${FS}:commit`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      writes: [
        {
          update: { name: `${DB}/tasks/${docId}`, fields },
          updateTransforms: [
            { fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' },
            { fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' },
          ],
          currentDocument: { exists: false },
        },
      ],
    }),
  });
  return res.status;
}

const getTask = async (token, docId) =>
  (await fetch(`${FS}/tasks/${docId}`, { headers: headers(token) })).status;

async function listTasksOf(token, userId) {
  const res = await fetch(`${FS}:runQuery`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'tasks' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'userId' },
            op: 'EQUAL',
            value: { stringValue: userId },
          },
        },
      },
    }),
  });
  return res.status;
}

async function updateTitle(token, docId) {
  const res = await fetch(`${FS}:commit`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      writes: [
        {
          update: { name: `${DB}/tasks/${docId}`, fields: { title: { stringValue: 'Hackeada' } } },
          updateMask: { fieldPaths: ['title'] },
          updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }],
        },
      ],
    }),
  });
  return res.status;
}

const deleteTask = async (token, docId) =>
  (await fetch(`${FS}/tasks/${docId}`, { method: 'DELETE', headers: headers(token) })).status;

async function deleteAccount(token) {
  await fetch(`${AUTH}:delete?key=${KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });
}

const userA = await signUp('a');
const userB = await signUp('b');
const docId = `rules-test-${Date.now()}`;

try {
  check('A crea su propia tarea', await createTask(userA.token, docId, taskFields(userA.uid)), 200);
  check('A lee su tarea', await getTask(userA.token, docId), 200);
  check('A lista sus tareas', await listTasksOf(userA.token, userA.uid), 200);

  check('B lee la tarea de A', await getTask(userB.token, docId), 403);
  check('B lista las tareas de A', await listTasksOf(userB.token, userA.uid), 403);
  check('B edita la tarea de A', await updateTitle(userB.token, docId), 403);
  check('B elimina la tarea de A', await deleteTask(userB.token, docId), 403);
  check('Sin sesión lee la tarea de A', await getTask(null, docId), 403);

  check(
    'B crea una tarea a nombre de A',
    await createTask(userB.token, `${docId}-spoof`, taskFields(userA.uid)),
    403,
  );
  check(
    'A crea una tarea con título vacío',
    await createTask(userA.token, `${docId}-empty`, taskFields(userA.uid, '   ')),
    403,
  );

  check('A edita su tarea', await updateTitle(userA.token, docId), 200);
  check('A elimina su tarea', await deleteTask(userA.token, docId), 200);
} finally {
  await deleteTask(userA.token, docId);
  await deleteAccount(userA.token);
  await deleteAccount(userB.token);
}

for (const r of results) {
  console.log(
    `${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  (esperado ${r.expected}, obtenido ${r.actual})`,
  );
}
const allPassed = results.every((r) => r.ok);
console.log(allPassed ? '\nTodas las verificaciones pasaron.' : '\nHay verificaciones fallidas.');
process.exitCode = allPassed ? 0 : 1;
