import styles from './Brand.module.css';

export const APP_NAME = 'Gestor de Tareas';

interface BrandProps {
  className?: string;
}

export function BrandMark({ className }: BrandProps) {
  return (
    <span className={[styles.mark, className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className={styles.dot} />
    </span>
  );
}

export function Brand({ className }: BrandProps) {
  return (
    <span className={[styles.brand, className].filter(Boolean).join(' ')}>
      <BrandMark />
      {APP_NAME}
    </span>
  );
}
