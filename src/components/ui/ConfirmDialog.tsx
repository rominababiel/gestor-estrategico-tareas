import { useEffect, useId, useRef, type MouseEvent, type SyntheticEvent } from 'react';
import { Alert } from './Alert';
import { Button } from './Button';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  isConfirming = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const requestCancel = () => {
    if (!isConfirming) onCancel();
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    requestCancel();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) requestCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p id={messageId} className={styles.message}>
          {message}
        </p>
        {error && <Alert>{error}</Alert>}
        <div className={styles.actions}>
          <Button variant="ghost" onClick={requestCancel} disabled={isConfirming}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
