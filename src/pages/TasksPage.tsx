import { useState } from 'react';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TodoForm } from '../components/tasks/TodoForm';
import { TodoList } from '../components/tasks/TodoList';
import { Alert } from '../components/ui/Alert';
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
  const { tasks, isLoading, error, createTask, updateTask, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');

  return (
    <div className={styles.page}>
      <section className={styles.card} aria-labelledby="new-task-title">
        <h2 id="new-task-title" className={styles.sectionTitle}>
          Nueva tarea
        </h2>
        <TodoForm onSubmit={createTask} />
      </section>

      <section className={styles.tasks} aria-labelledby="tasks-title">
        <h1 id="tasks-title" className={styles.title}>
          Mis tareas
        </h1>
        {error && <Alert>{error}</Alert>}
        {isLoading ? (
          <div className={styles.loading}>
            <Spinner label="Cargando tareas" />
          </div>
        ) : (
          <>
            <TaskFilters value={filter} counts={countTasks(tasks)} onChange={setFilter} />
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
