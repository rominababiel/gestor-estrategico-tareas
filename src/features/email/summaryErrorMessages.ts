import type { SummaryResult } from '../../types/summary';
import { getErrorCode } from '../../utils/errors';

const SUMMARY_ERROR_MESSAGES: Record<string, string> = {
  'missing-token': 'Tu sesión expiró. Iniciá sesión de nuevo.',
  'invalid-token': 'Tu sesión expiró. Iniciá sesión de nuevo.',
  'email-not-verified':
    'Primero verificá tu email con el link que te enviamos y después volvé a pedir el resumen.',
  'no-tasks': 'Todavía no tenés tareas para incluir en el resumen.',
  'network-error': 'No hay conexión. Revisá tu conexión a internet y probá de nuevo.',
};

const DEFAULT_SUMMARY_ERROR_MESSAGE =
  'No pudimos enviar el resumen. Probá de nuevo en unos minutos.';

export function getSummaryErrorMessage(error: unknown): string {
  const code = getErrorCode(error);
  return (code && SUMMARY_ERROR_MESSAGES[code]) || DEFAULT_SUMMARY_ERROR_MESSAGE;
}

export function getSummarySuccessMessage({ sentTo, taskCount }: SummaryResult): string {
  const tasks = taskCount === 1 ? 'tu tarea' : `tus ${taskCount} tareas`;
  return `Te enviamos el resumen de ${tasks} a ${sentTo}.`;
}
