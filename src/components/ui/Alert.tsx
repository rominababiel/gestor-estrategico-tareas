import type { ReactNode } from 'react';
import styles from './Alert.module.css';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  className?: string;
  children: ReactNode;
}

export function Alert({ variant = 'error', className, children }: AlertProps) {
  return (
    <div
      className={[styles.alert, styles[variant], className].filter(Boolean).join(' ')}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}
