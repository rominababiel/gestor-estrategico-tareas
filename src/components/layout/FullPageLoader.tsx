import { Spinner } from '../ui/Spinner';
import { Brand } from './Brand';
import styles from './FullPageLoader.module.css';

export function FullPageLoader() {
  return (
    <div className={styles.loader}>
      <Brand />
      <span className={styles.spinner}>
        <Spinner size="lg" label="Verificando sesión" />
      </span>
    </div>
  );
}
