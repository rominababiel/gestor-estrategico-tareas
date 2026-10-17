import { useState } from 'react';
import { getAuthErrorMessage } from '../../features/auth/authErrorMessages';
import { useForm } from '../../hooks/useForm';
import type { ForgotPasswordFormValues } from '../../types/auth';
import { validateForgotPasswordForm } from '../../utils/validators';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import styles from './AuthForm.module.css';

const INITIAL_VALUES: ForgotPasswordFormValues = { email: '' };

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [isSent, setIsSent] = useState(false);

  const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateForgotPasswordForm,
    onSubmit: async ({ email }) => {
      setIsSent(false);
      await onSubmit(email);
      setIsSent(true);
    },
    getErrorMessage: getAuthErrorMessage,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}
      {isSent && (
        <Alert variant="success">
          Si existe una cuenta con ese email, te enviamos un link para elegir una nueva contraseña.
          Revisá tu bandeja de entrada y la carpeta de spam.
        </Alert>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Enviar link
      </Button>
    </form>
  );
}
