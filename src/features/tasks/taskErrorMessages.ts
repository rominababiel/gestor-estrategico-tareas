import { getErrorCode } from '../../utils/errors';

const TASK_ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'No tenés permiso para realizar esta acción.',
  unauthenticated: 'Tu sesión expiró. Iniciá sesión de nuevo.',
  'not-found': 'La tarea ya no existe.',
  'failed-precondition': 'La base de datos se está preparando. Intentá de nuevo en unos minutos.',
  'resource-exhausted': 'Se alcanzó el límite de operaciones. Intentá más tarde.',
};

export const DEFAULT_TASK_ERROR_MESSAGE =
  'No pudimos guardar la tarea. Revisá tu conexión y probá de nuevo.';
const LOAD_TASKS_ERROR_MESSAGE =
  'No pudimos cargar tus tareas. Revisá tu conexión y probá de nuevo.';
const SAVE_CHANGE_ERROR_MESSAGE =
  'No pudimos guardar el cambio. Revisá tu conexión y probá de nuevo.';
const DELETE_TASK_ERROR_MESSAGE = 'No pudimos eliminar la tarea. Probá de nuevo.';

function resolveTaskErrorMessage(error: unknown, fallback: string): string {
  const code = getErrorCode(error);
  return (code && TASK_ERROR_MESSAGES[code]) || fallback;
}

export const getTaskErrorMessage = (error: unknown) =>
  resolveTaskErrorMessage(error, DEFAULT_TASK_ERROR_MESSAGE);

export const getLoadTasksErrorMessage = (error: unknown) =>
  resolveTaskErrorMessage(error, LOAD_TASKS_ERROR_MESSAGE);

export const getSaveChangeErrorMessage = (error: unknown) =>
  resolveTaskErrorMessage(error, SAVE_CHANGE_ERROR_MESSAGE);

export const getDeleteTaskErrorMessage = (error: unknown) =>
  resolveTaskErrorMessage(error, DELETE_TASK_ERROR_MESSAGE);
