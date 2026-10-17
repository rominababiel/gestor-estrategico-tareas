import { Link } from 'react-router-dom';
import { getAuthErrorMessage } from '../../features/auth/authErrorMessages';
import { useForm } from '../../hooks/useForm';
import { ROUTES } from '../../routes/paths';
import type { LoginFormValues } from '../../types/auth';
import { validateLoginForm } from '../../utils/validators';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import styles from './AuthForm.module.css';

const INITIAL_VALUES: LoginFormValues = { email: '', password: '' };

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateLoginForm,
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
        autoComplete="current-password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Link to={ROUTES.forgotPassword} className={styles.forgotLink}>
        ¿Olvidaste tu contraseña?
      </Link>
      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Iniciar sesión
      </Button>
    </form>
  );
}
