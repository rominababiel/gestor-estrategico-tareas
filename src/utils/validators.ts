import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from '../features/tasks/taskConstraints';
import type { ForgotPasswordFormValues, LoginFormValues, RegisterFormValues } from '../types/auth';
import type { FormErrors, FormValues } from '../types/form';
import type { TaskFormValues } from '../types/task';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 6;

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return 'El email es obligatorio.';
  if (!EMAIL_PATTERN.test(trimmed)) return 'Ingresá un email válido.';
  return undefined;
}

export function validateNewPassword(password: string): string | undefined {
  if (!password) return 'La contraseña es obligatoria.';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return undefined;
}

export function validateLoginForm(values: LoginFormValues): FormErrors<LoginFormValues> {
  return {
    email: validateEmail(values.email),
    password: values.password ? undefined : 'Ingresá tu contraseña.',
  };
}

export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues,
): FormErrors<ForgotPasswordFormValues> {
  return { email: validateEmail(values.email) };
}

export function validateRegisterForm(values: RegisterFormValues): FormErrors<RegisterFormValues> {
  return {
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
    confirmPassword:
      values.confirmPassword === values.password ? undefined : 'Las contraseñas no coinciden.',
  };
}

export function hasErrors<T extends FormValues>(errors: FormErrors<T>): boolean {
  return Object.values(errors).some(Boolean);
}

export function validateTaskForm(values: TaskFormValues): FormErrors<TaskFormValues> {
  const title = values.title.trim();

  return {
    title: !title
      ? 'El título es obligatorio.'
      : title.length > TASK_TITLE_MAX_LENGTH
        ? `El título puede tener hasta ${TASK_TITLE_MAX_LENGTH} caracteres.`
        : undefined,
    description:
      values.description.trim().length > TASK_DESCRIPTION_MAX_LENGTH
        ? `La descripción puede tener hasta ${TASK_DESCRIPTION_MAX_LENGTH} caracteres.`
        : undefined,
  };
}
