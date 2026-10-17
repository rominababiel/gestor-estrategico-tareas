import { getAuthErrorMessage } from '../../features/auth/authErrorMessages';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { Button } from '../ui/Button';
import styles from './EmailVerificationNotice.module.css';

const RESEND_SUCCESS_MESSAGE = 'Listo, te lo reenviamos. Revisá también la carpeta de spam.';
const RESEND_ERROR_MESSAGE = 'No pudimos reenviar el email. Probá de nuevo en unos minutos.';
const STILL_UNVERIFIED_MESSAGE =
  'Todavía no vemos la verificación. Abrí el link del email y volvé a tocar "Ya lo verifiqué".';

const getResendErrorMessage = () => RESEND_ERROR_MESSAGE;

interface EmailVerificationNoticeProps {
  email: string | null;
  onResend: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

interface Feedback {
  tone: 'success' | 'info' | 'error';
  message: string;
}

export function EmailVerificationNotice({
  email,
  onResend,
  onRefresh,
}: EmailVerificationNoticeProps) {
  const resend = useAsyncAction(onResend, getResendErrorMessage);
  const refresh = useAsyncAction(onRefresh, getAuthErrorMessage);

  const getFeedback = (): Feedback | null => {
    const error = resend.error ?? refresh.error;
    if (error) return { tone: 'error', message: error };
    if (resend.status === 'success') return { tone: 'success', message: RESEND_SUCCESS_MESSAGE };
    if (refresh.status === 'success') return { tone: 'info', message: STILL_UNVERIFIED_MESSAGE };
    return null;
  };

  const feedback = getFeedback();

  return (
    <section className={styles.notice} aria-label="Verificación de email">
      <p className={styles.message}>
        Te enviamos un email a <strong>{email}</strong> para verificar tu cuenta. Verificala para
        poder entrar también con Google sin perder tu contraseña.
      </p>
      <div className={styles.actions}>
        <Button
          size="sm"
          className={styles.resend}
          onClick={() => {
            refresh.reset();
            void resend.execute();
          }}
          isLoading={resend.isLoading}
        >
          Reenviar email
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={styles.verified}
          onClick={() => {
            resend.reset();
            void refresh.execute();
          }}
          isLoading={refresh.isLoading}
        >
          Ya lo verifiqué
        </Button>
      </div>
      <p className={styles.feedback} aria-live="polite">
        {feedback && <span className={styles[feedback.tone]}>{feedback.message}</span>}
      </p>
    </section>
  );
}
