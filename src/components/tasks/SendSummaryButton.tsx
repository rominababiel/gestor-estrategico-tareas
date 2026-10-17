import type { AsyncStatus } from '../../types/async';
import { Button } from '../ui/Button';
import styles from './SendSummaryButton.module.css';

interface SendSummaryButtonProps {
  status: AsyncStatus;
  disabled: boolean;
  onSend: () => void;
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <polyline
        points="2.5,7.5 5.5,10.5 11.5,3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function getLabel(status: AsyncStatus) {
  if (status === 'success') {
    return (
      <>
        <CheckIcon />
        Enviado
      </>
    );
  }

  if (status === 'error') return 'Reintentar';

  return (
    <>
      <span className={styles.short}>Enviar resumen</span>
      <span className={styles.long}>Enviar resumen por email</span>
    </>
  );
}

export function SendSummaryButton({ status, disabled, onSend }: SendSummaryButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={status === 'success' ? `${styles.button} ${styles.sent}` : styles.button}
      onClick={onSend}
      disabled={disabled}
      isLoading={status === 'loading'}
      loadingText="Enviando…"
    >
      {getLabel(status)}
    </Button>
  );
}
