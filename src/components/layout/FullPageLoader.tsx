import { Spinner } from '../ui/Spinner';
import styles from './FullPageLoader.module.css';

export function FullPageLoader() {
  return (
    <div className={styles.loader}>
      <Spinner size="lg" label="Verificando sesión" />
    </div>
  );
}
