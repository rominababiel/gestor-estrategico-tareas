import { describe, expect, it } from 'vitest';
import {
  hasErrors,
  validateEmail,
  validateLoginForm,
  validateRegisterForm,
  validateTaskForm,
} from '../../src/utils/validators';

describe('validateEmail', () => {
  it('requires an email', () => {
    expect(validateEmail('   ')).toBe('El email es obligatorio.');
  });

  it('rejects an email without domain', () => {
    expect(validateEmail('romi@gmail')).toBe('Ingresá un email válido.');
  });

  it('accepts a valid email with surrounding spaces', () => {
    expect(validateEmail('  romi@gmail.com ')).toBeUndefined();
  });
});

describe('validateLoginForm', () => {
  it('requires the password', () => {
    expect(validateLoginForm({ email: 'romi@gmail.com', password: '' }).password).toBe(
      'Ingresá tu contraseña.',
    );
  });
});

describe('validateRegisterForm', () => {
  it('rejects short passwords', () => {
    const errors = validateRegisterForm({
      email: 'romi@gmail.com',
      password: '123',
      confirmPassword: '123',
    });

    expect(errors.password).toBe('La contraseña debe tener al menos 6 caracteres.');
  });

  it('rejects passwords that do not match', () => {
    const errors = validateRegisterForm({
      email: 'romi@gmail.com',
      password: '123456',
      confirmPassword: '654321',
    });

    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden.');
  });

  it('has no errors for valid values', () => {
    const errors = validateRegisterForm({
      email: 'romi@gmail.com',
      password: '123456',
      confirmPassword: '123456',
    });

    expect(hasErrors(errors)).toBe(false);
  });
});

describe('validateTaskForm', () => {
  it('rejects an empty title', () => {
    expect(validateTaskForm({ title: '', description: '' }).title).toBe(
      'El título es obligatorio.',
    );
  });

  it('rejects a title with only spaces', () => {
    expect(validateTaskForm({ title: '    ', description: '' }).title).toBe(
      'El título es obligatorio.',
    );
  });

  it('rejects a title longer than 100 characters', () => {
    expect(validateTaskForm({ title: 'a'.repeat(101), description: '' }).title).toBe(
      'El título puede tener hasta 100 caracteres.',
    );
  });

  it('rejects a description longer than 500 characters', () => {
    expect(validateTaskForm({ title: 'Tarea', description: 'a'.repeat(501) }).description).toBe(
      'La descripción puede tener hasta 500 caracteres.',
    );
  });

  it('accepts a task without description', () => {
    expect(hasErrors(validateTaskForm({ title: 'Tarea', description: '' }))).toBe(false);
  });
});
