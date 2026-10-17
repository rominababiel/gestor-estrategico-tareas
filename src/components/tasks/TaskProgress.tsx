import styles from './TaskProgress.module.css';

interface TaskProgressProps {
  completed: number;
  total: number;
}

export function TaskProgress({ completed, total }: TaskProgressProps) {
  if (total === 0) return null;

  return (
    <div className={styles.progress}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Tareas completadas"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={completed}
      >
        <div className={styles.fill} style={{ width: `${(completed / total) * 100}%` }} />
      </div>
      <p className={styles.label}>
        <strong>{completed}</strong> de {total} completadas
      </p>
    </div>
  );
}
