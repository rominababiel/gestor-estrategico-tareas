import { getErrorCode } from '../../utils/errors';

const TASK_ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'No tenés permiso para realizar esta acción.',
  unauthenticated: 'Tu sesión expiró. Iniciá sesión de nuevo.',
  unavailable: 'No hay conexión con el servidor. Revisá tu conexión a internet.',
  'deadline-exceeded': 'El servidor tardó demasiado en responder. Intentá de nuevo.',
  'not-found': 'La tarea ya no existe.',
  'failed-precondition': 'La base de datos se está preparando. Intentá de nuevo en unos minutos.',
  'resource-exhausted': 'Se alcanzó el límite de operaciones. Intentá más tarde.',
};

export const DEFAULT_TASK_ERROR_MESSAGE = 'No se pudo completar la operación. Intentá de nuevo.';

export function getTaskErrorMessage(error: unknown): string {
  const code = getErrorCode(error);
  return (code && TASK_ERROR_MESSAGES[code]) || DEFAULT_TASK_ERROR_MESSAGE;
}
