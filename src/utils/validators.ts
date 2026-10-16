import type { LoginFormValues, RegisterFormValues } from '../types/auth';
import type { FormErrors, FormValues } from '../types/form';

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
    password: values.password ? undefined : 'La contraseña es obligatoria.',
  };
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
