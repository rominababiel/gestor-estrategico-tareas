import { useAuth } from '../hooks/useAuth';
import styles from './TasksPage.module.css';

export function TasksPage() {
  const { user } = useAuth();

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Mis tareas</h1>
      <p className={styles.muted}>Sesión iniciada como {user?.email}</p>
    </section>
  );
}
