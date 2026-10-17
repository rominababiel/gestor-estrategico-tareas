import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.message}>La dirección que buscás no existe.</p>
        <Link to={ROUTES.home} className={styles.link}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
