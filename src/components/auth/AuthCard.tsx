import type { ReactNode } from 'react';
import { Brand } from '../layout/Brand';
import styles from './AuthCard.module.css';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Brand className={styles.brand} />
        <section className={styles.card}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
          {children}
        </section>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </main>
  );
}
