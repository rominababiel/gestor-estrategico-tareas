import type { TaskCounts } from '../../features/tasks/filterTasks';
import type { TaskFilter } from '../../types/task';
import styles from './TaskFilters.module.css';

const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'Todas',
  pending: 'Pendientes',
  completed: 'Completadas',
};

const FILTERS: TaskFilter[] = ['all', 'pending', 'completed'];

interface TaskFiltersProps {
  value: TaskFilter;
  counts: TaskCounts;
  onChange: (filter: TaskFilter) => void;
}

export function TaskFilters({ value, counts, onChange }: TaskFiltersProps) {
  return (
    <div className={styles.filters} role="group" aria-label="Filtrar tareas">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={styles.filter}
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABELS[filter]} <span className={styles.count}>{counts[filter]}</span>
        </button>
      ))}
    </div>
  );
}
