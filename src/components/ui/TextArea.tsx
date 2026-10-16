import { useId, type TextareaHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, id, rows = 3, ...props }: TextAreaProps) {
  const generatedId = useId();
  const textAreaId = id ?? generatedId;
  const errorId = `${textAreaId}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={textAreaId} className={styles.label}>
        {label}
      </label>
      <textarea
        id={textAreaId}
        rows={rows}
        className={`${styles.control} ${styles.textarea}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
