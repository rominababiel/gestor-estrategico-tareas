import { getAuthErrorMessage } from '../../features/auth/authErrorMessages';
import { useForm } from '../../hooks/useForm';
import type { RegisterFormValues } from '../../types/auth';
import { MIN_PASSWORD_LENGTH, validateRegisterForm } from '../../utils/validators';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import styles from './AuthForm.module.css';

const INITIAL_VALUES: RegisterFormValues = { email: '', password: '', confirmPassword: '' };

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateRegisterForm,
    onSubmit,
    getErrorMessage: getAuthErrorMessage,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Input
        label="Repetir contraseña"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Crear cuenta
      </Button>
    </form>
  );
}
