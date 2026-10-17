import { useState } from 'react';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskProgress } from '../components/tasks/TaskProgress';
import { TodoForm } from '../components/tasks/TodoForm';
import { TodoList } from '../components/tasks/TodoList';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { countTasks, filterTasks } from '../features/tasks/filterTasks';
import { useTasks } from '../hooks/useTasks';
import type { TaskFilter } from '../types/task';
import styles from './TasksPage.module.css';

const EMPTY_MESSAGES: Record<TaskFilter, string> = {
  all: 'Todavía no tenés tareas. Creá la primera con el formulario.',
  pending: 'No tenés tareas pendientes.',
  completed: 'Todavía no completaste ninguna tarea.',
};

export function TasksPage() {
  const { tasks, isLoading, error, createTask, updateTask, toggleTask, deleteTask, retry } =
    useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');
  const counts = countTasks(tasks);
  const isReady = !isLoading && !error;

  return (
    <div className={styles.page}>
      <section className={styles.card} aria-labelledby="new-task-title">
        <h2 id="new-task-title" className={styles.sectionTitle}>
          Nueva tarea
        </h2>
        <TodoForm onSubmit={createTask} />
      </section>

      <section className={styles.tasks} aria-labelledby="tasks-title">
        <div className={styles.heading}>
          <h1 id="tasks-title" className={styles.title}>
            Mis tareas
          </h1>
          {isReady && <TaskProgress completed={counts.completed} total={counts.all} />}
        </div>

        {isLoading && (
          <div className={styles.loading} role="status">
            <span className={styles.loadingSpinner}>
              <Spinner size="md" />
            </span>
            Cargando tus tareas…
          </div>
        )}

        {error && (
          <Alert className={styles.loadError}>
            <span className={styles.loadErrorMessage}>{error}</span>
            <Button variant="secondary" size="sm" className={styles.retry} onClick={retry}>
              Reintentar
            </Button>
          </Alert>
        )}

        {isReady && (
          <>
            <TaskFilters value={filter} counts={counts} onChange={setFilter} />
            <TodoList
              tasks={filterTasks(tasks, filter)}
              emptyMessage={EMPTY_MESSAGES[filter]}
              onToggle={toggleTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          </>
        )}
      </section>
    </div>
  );
}
