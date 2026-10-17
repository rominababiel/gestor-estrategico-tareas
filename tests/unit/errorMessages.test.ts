import { describe, expect, it } from 'vitest';
import {
  DEFAULT_AUTH_ERROR_MESSAGE,
  getAuthErrorMessage,
} from '../../src/features/auth/authErrorMessages';
import {
  getLoadTasksErrorMessage,
  getTaskErrorMessage,
} from '../../src/features/tasks/taskErrorMessages';

describe('getAuthErrorMessage', () => {
  it('translates a known Firebase code', () => {
    expect(getAuthErrorMessage({ code: 'auth/invalid-email' })).toBe('El email no es válido.');
  });

  it('falls back to a generic message for unknown codes', () => {
    expect(getAuthErrorMessage({ code: 'auth/something-new' })).toBe(DEFAULT_AUTH_ERROR_MESSAGE);
  });

  it('never exposes the raw error', () => {
    expect(getAuthErrorMessage(new Error('Firebase: internal'))).toBe(DEFAULT_AUTH_ERROR_MESSAGE);
  });
});

describe('task error messages', () => {
  it('keeps specific messages for known codes', () => {
    expect(getLoadTasksErrorMessage({ code: 'permission-denied' })).toBe(
      'No tenés permiso para realizar esta acción.',
    );
  });

  it('uses the context message for network errors', () => {
    expect(getLoadTasksErrorMessage({ code: 'unavailable' })).toBe(
      'No pudimos cargar tus tareas. Revisá tu conexión y probá de nuevo.',
    );
  });

  it('uses the default message when there is no code', () => {
    expect(getTaskErrorMessage(undefined)).toBe(
      'No pudimos guardar la tarea. Revisá tu conexión y probá de nuevo.',
    );
  });
});
