import { getAuthErrorMessage } from '../../features/auth/authErrorMessages';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import styles from './EmailVerificationNotice.module.css';

interface EmailVerificationNoticeProps {
  email: string | null;
  onResend: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function EmailVerificationNotice({
  email,
  onResend,
  onRefresh,
}: EmailVerificationNoticeProps) {
  const resend = useAsyncAction(onResend, getAuthErrorMessage);
  const refresh = useAsyncAction(onRefresh, getAuthErrorMessage);

  const feedback =
    resend.error ??
    refresh.error ??
    (resend.status === 'success' ? 'Te reenviamos el email de verificación.' : null) ??
    (refresh.status === 'success'
      ? 'Tu email todavía no figura como verificado. Revisá tu bandeja de entrada y la carpeta de spam.'
      : null);

  return (
    <Alert variant="info">
      <div className={styles.content}>
        <p>
          Te enviamos un email a <strong>{email}</strong> para verificar tu cuenta. Verificala para
          poder entrar también con Google sin perder tu contraseña.
        </p>
        {feedback && <p className={styles.feedback}>{feedback}</p>}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => {
              refresh.reset();
              void resend.execute();
            }}
            isLoading={resend.isLoading}
          >
            Reenviar email
          </Button>
          <Button
            onClick={() => {
              resend.reset();
              void refresh.execute();
            }}
            isLoading={refresh.isLoading}
          >
            Ya lo verifiqué
          </Button>
        </div>
      </div>
    </Alert>
  );
}
