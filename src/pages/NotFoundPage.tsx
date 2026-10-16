import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Página no encontrada</h1>
      <p>La dirección que buscás no existe.</p>
      <Link to={ROUTES.home}>Volver al inicio</Link>
    </main>
  );
}
