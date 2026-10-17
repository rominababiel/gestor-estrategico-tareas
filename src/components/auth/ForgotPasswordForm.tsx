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
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { values, errors, submitError, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateForgotPasswordForm,
    onSubmit: async ({ email }) => {
      setSentTo(null);
      await onSubmit(email);
      setSentTo(email.trim());
    },
    getErrorMessage: getAuthErrorMessage,
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {submitError && <Alert>{submitError}</Alert>}
      {sentTo && (
        <Alert variant="success">
          Listo. Si {sentTo} tiene una cuenta, te va a llegar el link en unos minutos. Revisá
          también la carpeta de spam.
        </Alert>
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        disabled={isSubmitting}
        error={errors.email}
      />
      <Button type="submit" fullWidth isLoading={isSubmitting} loadingText="Enviando…">
        Enviar link
      </Button>
    </form>
  );
}
