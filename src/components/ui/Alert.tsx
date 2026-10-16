import type { ReactNode } from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  children: ReactNode;
}

export function Alert({ variant = 'error', children }: AlertProps) {
  return (
    <div
      className={`${styles.alert} ${styles[variant]}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
